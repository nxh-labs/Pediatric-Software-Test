import { useEventBus } from "domain-eventrix/react";
import Button from "./Button";
import { createStoreIndexes, DB_CONFIG, IndexedDBConnection, PediatricAppProvider } from "../adapter";
import { useEffect, useState } from "react";
import { formatError, IEventBus, Result } from "@shared";
import { DataFileManager } from "./scripts";

function App() {
   const [dbOpened, setDbOpened] = useState(false);
   const [downloadStatus, setDownloadStatus] = useState<string>('');
   const eventBus = useEventBus();
   const dbConnection = new IndexedDBConnection(
     DB_CONFIG.name, 
     DB_CONFIG.version, 
     (db: IDBDatabase) => createStoreIndexes(db)
   );

   useEffect(() => {
      async function initialize() {
         try {
            await dbConnection.open();
            setDbOpened(true);
            
            setDownloadStatus('Starting download...');
            const result = await loadPediatricData();
            
            if (result.isFailure) {
               setDownloadStatus(`Error: ${result.err}`);
               console.error('Failed to load pediatric data:', result.err);
            } else {
               setDownloadStatus('Data loaded successfully');
               console.log('Successfully loaded pediatric data');
               // Log the content of the zip file
               const files = result.val;
               console.log('Files in zip:', Array.from(files.keys()));
            }
         } catch (error) {
            setDownloadStatus(`Unexpected error: ${error}`);
            console.error('Initialization error:', error);
         }
      }

      initialize();

      return () => {
         dbConnection.close();
         setDbOpened(false);
      };
   }, []);

async function loadPediatricData(): Promise<Result<Map<string, ArrayBuffer>>> {
   try {
      const dataManager = new DataFileManager();

      setDownloadStatus('Loading pediatric data...');
      const result = await dataManager.loadPediatricData();
      
      if (result.isFailure) {
         setDownloadStatus(`Error: ${result.err}`);
         return Result.fail(result.err);
      }

      setDownloadStatus('Data loaded successfully');
      return result;
   } catch (error) {
      setDownloadStatus(`Unexpected error: ${error}`);
      return Result.fail(`Unexpected error: ${error}`);
   }
}
   if (!dbOpened) return <div>Initializing database...</div>;
   
   return (
      <PediatricAppProvider dbConnection={dbConnection} eventBus={eventBus as unknown as IEventBus}>
         <div>
            <div>Status: {downloadStatus}</div>
            <Button hello="Hello" />
         </div>
      </PediatricAppProvider>
   );
}

export default App;
