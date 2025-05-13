import { GrowthReferenceTable, GrowthReferenceTableRepository } from "@core/diagnostics";
import { SystemCode } from "@shared";
import { EntityBaseRepository } from "../../../common";
import { GrowthReferenceTablePersistenceDto } from "../../persistenceDto";

export class GrowthReferenceTableRepositoryImpl 
    extends EntityBaseRepository<GrowthReferenceTable, GrowthReferenceTablePersistenceDto> 
    implements GrowthReferenceTableRepository {
    
    protected storeName = "growth_reference_tables";

    async getByCode(code: SystemCode): Promise<GrowthReferenceTable> {
        try {
            const store = await this.getObjectStore();
            return new Promise((resolve, reject) => {
                const request = store.index("code").get(code.unpack());

                request.onsuccess = (event) => {
                    const result = (event.target as IDBRequest).result;
                    if (!result) {
                        reject(new Error(`GrowthReferenceTable with code ${code.unpack()} not found`));
                        return;
                    }
                    resolve(this.mapper.toDomain(result as GrowthReferenceTablePersistenceDto));
                };

                request.onerror = (event) => {
                    console.error("Error fetching growth reference table by code:", event);
                    reject(new Error("Failed to fetch growth reference table"));
                };
            });
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get growth reference table by code: ${error}`);
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