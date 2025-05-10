export class IndexedDBConnection {
    private dbName: string;
    private dbVersion: number;
    private db: IDBDatabase | null;

    constructor(dbName: string, dbVersion: number) {
        this.dbName = dbName;
        this.dbVersion = dbVersion;
        this.db = null;
    }

    open(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject((event.target as IDBOpenDBRequest).error);
            };

            request.onupgradeneeded = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                // Initialize database schema here if needed
            };
        });
    }

    close(): void {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}