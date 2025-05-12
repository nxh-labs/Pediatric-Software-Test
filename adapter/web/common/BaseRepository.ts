import { AggregateID } from '@shared';
import { IndexedDBConnection } from './IndexedDBConnection';
import { InfrastructureMapper } from './InfrastructureMapper';

export abstract class BaseRepository<DomainEntity, PersistenceModel>{
    protected abstract storeName: string;

    constructor(
        protected readonly dbConnection: IndexedDBConnection,
        protected readonly mapper: InfrastructureMapper<DomainEntity, PersistenceModel>
    ) {}

    protected async getObjectStore(mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
        const db = await this.dbConnection.open();
        const transaction = db.transaction(this.storeName, mode);
        return transaction.objectStore(this.storeName);
    }

    protected async save(entity: DomainEntity): Promise<void> {
        const store = await this.getObjectStore('readwrite');
        const data = this.mapper.toPersistence(entity);
        await store.put(data);
    }

    protected async findById(id: AggregateID): Promise<DomainEntity | null> {
        const store = await this.getObjectStore();
        const result = await store.get(id.toString());
        if (!result) return null;
        return this.mapper.toDomain(result as PersistenceModel);
    }
}