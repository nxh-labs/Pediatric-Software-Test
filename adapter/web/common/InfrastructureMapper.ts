export interface InfrastructureMapper<DomainEntity, PersistenceModel> {
    toPersistence(entity: DomainEntity): PersistenceModel;
    toDomain(model: PersistenceModel): DomainEntity;
}