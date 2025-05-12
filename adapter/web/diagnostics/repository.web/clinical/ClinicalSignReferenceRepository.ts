
import { ClinicalSignReference, ClinicalSignReferenceRepository } from "@core/diagnostics";
import { SystemCode } from "@shared";
import { EntityBaseRepository } from "../../../common";
import { ClinicalSignReferencePersistenceDto } from "../../persistenceDto";

export class ClinicalSignReferenceRepositoryImpl 
    extends EntityBaseRepository<ClinicalSignReference, ClinicalSignReferencePersistenceDto> 
    implements ClinicalSignReferenceRepository {
    
    protected storeName = "clinical_sign_references";

    async getByCode(code: SystemCode): Promise<ClinicalSignReference> {
        try {
            const store = await this.getObjectStore();
            return new Promise((resolve, reject) => {
                const request = store.index("code").get(code.unpack());

                request.onsuccess = (event) => {
                    const result = (event.target as IDBRequest).result;
                    if (!result) {
                        reject(new Error(`ClinicalSignReference with code ${code.unpack()} not found`));
                        return;
                    }
                    resolve(this.mapper.toDomain(result as ClinicalSignReferencePersistenceDto));
                };

                request.onerror = (event) => {
                    console.error("Error fetching clinical sign reference by code:", event);
                    reject(new Error("Failed to fetch clinical sign reference"));
                };
            });
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get clinical sign reference by code: ${error}`);
        }
    }

    async getAllCode(): Promise<SystemCode[]> {
        try {
            const store = await this.getObjectStore();
            return new Promise((resolve, reject) => {
                const request = store.index("code").getAllKeys();

                request.onsuccess = (event) => {
                    const results = (event.target as IDBRequest).result;
                    if (!results) {
                        resolve([]);
                        return;
                    }
                    const codes = results.map((code: string) => 
                        SystemCode.create(code).val
                    );
                    resolve(codes);
                };

                request.onerror = (event) => {
                    console.error("Error fetching codes:", event);
                    reject(new Error("Failed to fetch codes"));
                };
            });
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get all codes: ${error}`);
        }
    }
}