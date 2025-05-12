import { NutritionalDiagnostic, NutritionalDiagnosticRepository } from "@core/diagnostics";
import { AggregateID } from "@shared";
import { EntityBaseRepository } from "../../../common";
import { NutritionalDiagnosticPersistenceDto } from "../../persistenceDto";


export class NutritionalDiagnosticRepositoryImpl 
    extends EntityBaseRepository<NutritionalDiagnostic, NutritionalDiagnosticPersistenceDto> 
    implements NutritionalDiagnosticRepository {
    
    protected storeName = "nutritional_diagnostics";

    async getByPatient(patientId: AggregateID): Promise<NutritionalDiagnostic> {
        try {
            const store = await this.getObjectStore();
            return new Promise((resolve, reject) => {
                const request = store.index("patientId").get(patientId.toString());

                request.onsuccess = (event) => {
                    const result = (event.target as IDBRequest).result;
                    if (!result) {
                        reject(new Error(`NutritionalDiagnostic for patient ${patientId} not found`));
                        return;
                    }
                    resolve(this.mapper.toDomain(result as NutritionalDiagnosticPersistenceDto));
                };

                request.onerror = (event) => {
                    console.error("Error fetching nutritional diagnostic:", event);
                    reject(new Error("Failed to fetch nutritional diagnostic"));
                };
            });
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get nutritional diagnostic: ${error}`);
        }
    }
}