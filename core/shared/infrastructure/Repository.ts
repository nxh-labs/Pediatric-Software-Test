import { AggregateID, Entity } from "../domain";

export interface Repository<DomainEntity extends Entity<any>> {
   getById(id: AggregateID): Promise<DomainEntity>;
   save(entity: DomainEntity): Promise<void>;
   delete(id: AggregateID): Promise<void>;
}
