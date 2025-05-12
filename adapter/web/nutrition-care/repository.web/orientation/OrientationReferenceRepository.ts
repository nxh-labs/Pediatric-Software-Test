
import { OrientationReference, OrientationReferenceRepository } from "@core/nutrition_care";
import { EntityBaseRepository } from "../../../common";
import { OrientationReferencePersistenceDto } from "../../mappers";
import { SystemCode } from "@shared";

export class OrientationReferenceRepositoryImpl 
    extends EntityBaseRepository<OrientationReference, OrientationReferencePersistenceDto> 
    implements OrientationReferenceRepository {
    
    protected storeName = "orientation_refs";

    async getByCode(code: SystemCode): Promise<OrientationReference> {
        try {
            const store = await this.getObjectStore();
            return new Promise((resolve, reject) => {
                const request = store.index("code").get(code.unpack());

                request.onsuccess = (event) => {
                    const result = (event.target as IDBRequest).result;
                    if (!result) {
                        reject(new Error(`OrientationReference with code ${code.unpack()} not found`));
                        return;
                    }
                    resolve(this.mapper.toDomain(result as OrientationReferencePersistenceDto));
                };

                request.onerror = (event) => {
                    console.error("Error fetching orientation reference by code:", event);
                    reject(new Error("Failed to fetch orientation reference"));
                };
            });
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get orientation reference by code: ${error}`);
        }
    }
}