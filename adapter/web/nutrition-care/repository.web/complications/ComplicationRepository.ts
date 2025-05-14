
import { Complication, ComplicationRepository } from "@core/nutrition_care";
import { EntityBaseRepository } from "../../../common";
import { ComplicationPersistenceDto } from "../../mappers";
import { SystemCode } from "@shared";


export class ComplicationRepositoryImpl 
    extends EntityBaseRepository<Complication, ComplicationPersistenceDto> 
    implements ComplicationRepository {
    
    protected storeName = "complications";
  async exist(code: SystemCode): Promise<boolean> {
       try {
          const store = await this.getObjectStore();
          return new Promise((resolve, reject) => {
             const request = store.index("code").count(code.unpack());
 
             request.onsuccess = (event) => {
                const count = (event.target as IDBRequest).result;
                resolve(count > 0);
             };
 
             request.onerror = (event) => {
                console.error("Error checking existence:", event);
                reject(new Error("Failed to check complication existence"));
             };
          });
       } catch (error) {
          console.error(error);
          throw new Error(`Failed to check complication existence: ${error}`);
       }
    }
 
}