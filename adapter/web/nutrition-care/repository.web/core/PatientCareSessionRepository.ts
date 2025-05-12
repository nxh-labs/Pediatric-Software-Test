
import { EntityBaseRepository } from "../../../common";

import { AggregateID } from "@shared";
import { PatientCareSessionPersistenceDto } from "../../mappers";
import { PatientCareSession, PatientCareSessionRepository } from "@core/nutrition_care";

export class PatientCareSessionRepositoryImpl 
    extends EntityBaseRepository<PatientCareSession, PatientCareSessionPersistenceDto> 
    implements PatientCareSessionRepository {
    
    protected storeName = "patient_care_sessions";

    async getByIdOrPatientId(sessionIdOrPatientId: AggregateID): Promise<PatientCareSession> {
        try {
            const store = await this.getObjectStore();
            return new Promise((resolve, reject) => {
                // Essayer d'abord avec l'ID de session
                const idRequest = store.index("id").get(sessionIdOrPatientId.toString());

                idRequest.onsuccess = async (event) => {
                    let result = (event.target as IDBRequest).result;
                    
                    if (!result) {
                        // Si pas trouvé par ID, essayer avec l'ID patient
                        const patientIdRequest = store.index("patientId").get(sessionIdOrPatientId.toString());
                        
                        patientIdRequest.onsuccess = (event) => {
                            result = (event.target as IDBRequest).result;
                            if (!result) {
                                reject(new Error("PatientCareSession not found"));
                                return;
                            }
                            resolve(this.mapper.toDomain(result as PatientCareSessionPersistenceDto));
                        };

                        patientIdRequest.onerror = (event) => {
                            console.error("Error fetching by patient ID:", event);
                            reject(new Error("Failed to fetch by patient ID"));
                        };
                    } else {
                        resolve(this.mapper.toDomain(result as PatientCareSessionPersistenceDto));
                    }
                };

                idRequest.onerror = (event) => {
                    console.error("Error fetching by ID:", event);
                    reject(new Error("Failed to fetch by ID"));
                };
            });
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get PatientCareSession: ${error}`);
        }
    }
}