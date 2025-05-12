import { Patient, PatientRepository } from "@core/patient";
import { EntityBaseRepository, IndexedDBConnection } from "../../common";
import { PatientPersistenceDto } from "../persistenceDto";
import { AggregateID, InfrastructureMapper } from "@shared";

export class PatientRepositoryImpl extends EntityBaseRepository<Patient, PatientPersistenceDto> implements PatientRepository {
    protected storeName = "patients";

    constructor(
        dbConnection: IndexedDBConnection,
        mapper: InfrastructureMapper<Patient, PatientPersistenceDto>
    ) {
        super(dbConnection, mapper);
    }

    async exist(id: AggregateID): Promise<boolean> {
        try {
            const store = await this.getObjectStore();
            return new Promise((resolve, reject) => {
                const request = store.index("id").count(id.toString());

                request.onsuccess = (event) => {
                    const count = (event.target as IDBRequest).result;
                    resolve(count > 0);
                };

                request.onerror = (event) => {
                    console.error("Error checking patient existence:", event);
                    reject(new Error("Failed to check patient existence"));
                };
            });
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to check patient existence: ${error}`);
        }
    }

    async remove(patient: Patient): Promise<void> {
        try {
            if (!patient.id) {
                throw new Error("Cannot remove patient without id");
            }
            
            const exists = await this.exist(patient.id as AggregateID);
            if (!exists) {
                throw new Error(`Patient with id ${patient.id} not found`);
            }
            
            await this.delete(patient.id as AggregateID);
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to remove patient: ${error}`);
        }
    }
}