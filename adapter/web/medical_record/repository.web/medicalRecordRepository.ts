import { MedicalRecord, MedicalRecordRepository } from "@core/medical_record";
import { EntityBaseRepository } from "../../common";
import { MedicalRecordPersistenceDto } from "../persistenceDto";
import { AggregateID } from "@shared";

export class MedicalRecordRepositoryImpl 
    extends EntityBaseRepository<MedicalRecord, MedicalRecordPersistenceDto> 
    implements MedicalRecordRepository {
    
    protected storeName = "medical_records";

    async getByPatientIdOrID(patientIdOrId: AggregateID): Promise<MedicalRecord> {
        try {
            const store = await this.getObjectStore();
            return new Promise((resolve, reject) => {
                // Essayer d'abord avec l'ID patient
                const patientIdRequest = store.index("patientId").get(patientIdOrId.toString());

                patientIdRequest.onsuccess = async (event) => {
                    let result = (event.target as IDBRequest).result;
                    
                    if (!result) {
                        // Si pas trouvé par patientId, essayer avec l'ID du dossier
                        const idRequest = store.index("id").get(patientIdOrId.toString());
                        
                        idRequest.onsuccess = (event) => {
                            result = (event.target as IDBRequest).result;
                            if (!result) {
                                reject(new Error("Medical Record not found"));
                                return;
                            }
                            resolve(this.mapper.toDomain(result as MedicalRecordPersistenceDto));
                        };

                        idRequest.onerror = (event) => {
                            console.error("Error fetching by ID:", event);
                            reject(new Error("Failed to fetch medical record"));
                        };
                    } else {
                        resolve(this.mapper.toDomain(result as MedicalRecordPersistenceDto));
                    }
                };

                patientIdRequest.onerror = (event) => {
                    console.error("Error fetching by patient ID:", event);
                    reject(new Error("Failed to fetch medical record"));
                };
            });
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get medical record: ${error}`);
        }
    }
}