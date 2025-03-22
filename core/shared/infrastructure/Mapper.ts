import { Entity } from "../domain";

export interface InfrastructureMapper<
  DomainEntity extends Entity<any>,
  PersistenceType extends Object
> {
  toPersistence(entity: DomainEntity): PersistenceType;
  toDomain(record: PersistenceType): DomainEntity;
}
