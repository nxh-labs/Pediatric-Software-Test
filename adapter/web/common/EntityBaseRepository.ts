import { AggregateID, AggregateRoot, Entity, EntityPropsBaseType, InfrastructureMapper, IEventBus, Repository } from "@shared";
import { IndexedDBConnection } from "./IndexedDBConnection";

export abstract class EntityBaseRepository<DomainEntity extends Entity<EntityPropsBaseType>, PersistenceModel extends object>
   implements Repository<DomainEntity>
{
   protected abstract storeName: string;

   constructor(
      protected readonly dbConnection: IndexedDBConnection,
      protected readonly mapper: InfrastructureMapper<DomainEntity, PersistenceModel>,
      protected readonly eventBus: IEventBus | null = null,
   ) {}
   protected async getObjectStore(mode: IDBTransactionMode = "readonly"): Promise<IDBObjectStore> {
      const db = await this.dbConnection.open();
      const transaction = db.transaction(this.storeName, mode);
      return transaction.objectStore(this.storeName);
   }

   async getById(id: AggregateID): Promise<DomainEntity> {
      try {
         const store = await this.getObjectStore();
         return new Promise((resolve, reject) => {
            const idRequest = store.index("id").get(id.toString());

            idRequest.onsuccess = (event) => {
               const result = (event.target as IDBRequest).result;
               if (!result) {
                  reject(new Error("Entity Not found"));
                  return;
               }
               resolve(this.mapper.toDomain(result as PersistenceModel));
            };

            idRequest.onerror = (event) => {
               console.error("Error fetching by ID:", event);
               reject(new Error("Failed to fetch entity"));
            };
         });
      } catch (error) {
         console.error(error);
         throw new Error(error as string);
      }
   }
   async save(entity: DomainEntity): Promise<void> {
      try {
         const store = await this.getObjectStore("readwrite");
         const data = this.mapper.toPersistence(entity);
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         const { id, ...otherProps } = data as any;
         await store.put(otherProps, id);
         if (entity instanceof AggregateRoot) {
            const domainEvents = entity.getDomainEvents();
            if (this.eventBus) {
               const eventPublishingPromises = domainEvents.map(this.eventBus.publishAndDispatchImmediate);
               await Promise.all(eventPublishingPromises);
            }
         }
      } catch (error) {
         console.error(error);
      }
   }
   async delete(id: AggregateID): Promise<void> {
      try {
         const store = await this.getObjectStore("readwrite");
         store.delete(id);
      } catch (error) {
         console.log(error);
      }
   }
   async getAll(): Promise<DomainEntity[]> {
      try {
         const store = await this.getObjectStore();
         return new Promise((resolve, reject) => {
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = (event) => {
               const result = (event.target as IDBRequest).result;
               if (!result) {
                  resolve([]);
                  return;
               }
               const entities = result.map((item: PersistenceModel) => this.mapper.toDomain(item));
               resolve(entities);
            };

            getAllRequest.onerror = (event) => {
               console.error("Error fetching all entities:", event);
               reject(new Error("Failed to fetch entities"));
            };
         });
      } catch (error) {
         console.error(error);
         throw new Error(`Failed to get all entities: ${error}`);
      }
   }
}
