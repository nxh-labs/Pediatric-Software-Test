export interface ExtractedFile {
  name: string;
  content: ArrayBuffer;
  timestamp: number;
}

export interface FileStructure {
  path: string;
  type: 'json' | 'csv' | 'xml' | 'other';
  processor?: (data: ArrayBuffer) => Promise<any>;
}

export interface DataStructure {
  [key: string]: {
    files: FileStructure[];
    description: string;
  }
}