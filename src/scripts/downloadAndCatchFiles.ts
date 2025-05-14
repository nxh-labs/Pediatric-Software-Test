import { formatError, Result } from "@shared";
import JSZip from "jszip";
import { ExtractedFile } from "./types";

interface DownloadProgress {
  loaded: number;
  total: number;
  percent: number;
}

const PediatricSoftWareData = {
   localURL: "/PediatricSoftWareData.zip",
   storeName: "extractedFiles",
};

export class DataFileManager {
   private db: IDBDatabase | null = null;

   constructor() {
      this.initDB();
   }

   private async initDB(): Promise<void> {
      return new Promise((resolve, reject) => {
         const request = indexedDB.open("PediatricData", 1);
         
         request.onerror = () => reject(request.error);
         request.onsuccess = () => {
            this.db = request.result;
            resolve();
         };
         
         request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(PediatricSoftWareData.storeName)) {
               db.createObjectStore(PediatricSoftWareData.storeName, { keyPath: "name" });
            }
         };
      });
   }

   private async getFromCache(): Promise<Map<string, ArrayBuffer> | null> {
      if (!this.db) return null;

      return new Promise((resolve) => {
         const transaction = this.db!.transaction([PediatricSoftWareData.storeName], "readonly");
         const store = transaction.objectStore(PediatricSoftWareData.storeName);
         const request = store.getAll();

         request.onsuccess = () => {
            if (request.result && request.result.length > 0) {
               const filesMap = new Map<string, ArrayBuffer>();
               request.result.forEach((file: ExtractedFile) => {
                  filesMap.set(file.name, file.content);
               });
               resolve(filesMap);
            } else {
               resolve(null);
            }
         };

         request.onerror = () => resolve(null);
      });
   }

   private async saveToCache(files: Map<string, ArrayBuffer>): Promise<void> {
      if (!this.db) return;

      const transaction = this.db.transaction([PediatricSoftWareData.storeName], "readwrite");
      const store = transaction.objectStore(PediatricSoftWareData.storeName);

      for (const [name, content] of files.entries()) {
         const file: ExtractedFile = {
            name,
            content,
            timestamp: Date.now()
         };
         store.put(file);
      }
   }

   async downloadFile(onProgress?: (progress: DownloadProgress) => void): Promise<Result<ArrayBuffer>> {
      try {
         console.log("Starting download from:", PediatricSoftWareData.localURL);
         
         const response = await fetch(PediatricSoftWareData.localURL);
         if (!response.ok) {
            return Result.fail(`HTTP error! status: ${response.status}`);
         }

         const reader = response.body?.getReader();
         const contentLength = Number(response.headers.get('content-length')) || 0;

         if (!reader) {
            return Result.fail('Unable to read response');
         }

         const chunks: Uint8Array[] = [];
         let receivedLength = 0;

         while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            chunks.push(value);
            receivedLength += value.length;

            if (onProgress && contentLength) {
               onProgress({
                  loaded: receivedLength,
                  total: contentLength,
                  percent: (receivedLength / contentLength) * 100
               });
            }
         }

         const arrayBuffer = new Uint8Array(receivedLength);
         let position = 0;
         for (const chunk of chunks) {
            arrayBuffer.set(chunk, position);
            position += chunk.length;
         }

         return Result.ok(arrayBuffer.buffer);
      } catch (error) {
         console.error("Download error:", error);
         return Result.fail(`Download failed: ${error}`);
      }
   }

   async extractZipContent(zipData: ArrayBuffer): Promise<Result<Map<string, ArrayBuffer>>> {
      try {
         const zip = await JSZip.loadAsync(zipData);
         const files = new Map<string, ArrayBuffer>();

         for (const [filename, file] of Object.entries(zip.files)) {
            if (!file.dir) {
               const content = await file.async("arraybuffer");
               files.set(filename, content);
            }
         }

         return Result.ok(files);
      } catch (error) {
         console.error("Extraction error:", error);
         return Result.fail(`Extraction failed: ${error}`);
      }
   }

   async loadPediatricData(): Promise<Result<Map<string, ArrayBuffer>>> {
      try {
         // Vérifier d'abord le cache
         const cachedFiles = await this.getFromCache();
         if (cachedFiles) {
            console.log("Using cached files");
            return Result.ok(cachedFiles);
         }

         // Si pas en cache, télécharger et extraire
         const downloadResult = await this.downloadFile();
         if (downloadResult.isFailure) {
            return Result.fail(formatError(downloadResult));
         }

         const extractResult = await this.extractZipContent(downloadResult.val);
         if (extractResult.isFailure) {
            return Result.fail(formatError(extractResult));
         }

         // Sauvegarder les fichiers extraits dans le cache
         await this.saveToCache(extractResult.val);

         return extractResult;
      } catch (error) {
         return Result.fail(`Failed to load data: ${error}`);
      }
   }
}