export class BaseRepository<T> {
    private db: IDBDatabase;
    private storeName: string;

    constructor(db: IDBDatabase, storeName: string) {
        this.db = db;
        this.storeName = storeName;
    }

    create(item: T): Promise<IDBRequest> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(item);

            request.onsuccess = () => resolve(request);
            request.onerror = () => reject(request.error);
        });
    }

    read(key: IDBValidKey): Promise<T> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    update(item: T): Promise<IDBRequest> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(item);

            request.onsuccess = () => resolve(request);
            request.onerror = () => reject(request.error);
        });
    }

    delete(key: IDBValidKey): Promise<IDBRequest> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);

            request.onsuccess = () => resolve(request);
            request.onerror = () => reject(request.error);
        });
    }
}