import { NutritionalRiskFactor, NutritionalRiskFactorRepository } from "@core/diagnostics";
import { EntityBaseRepository, IndexedDBConnection } from "../../../common";
import { NutritionalRiskFactorPersistenceDto } from "../../persistenceDto";
import { InfrastructureMapper, SystemCode } from "@shared";

export class NutritionalRiskFactorRepoImpl
   extends EntityBaseRepository<NutritionalRiskFactor, NutritionalRiskFactorPersistenceDto>
   implements NutritionalRiskFactorRepository
{
   protected storeName: string = "nutritional_risk_factors";

   constructor(dbConnection: IndexedDBConnection, mapper: InfrastructureMapper<NutritionalRiskFactor, NutritionalRiskFactorPersistenceDto>) {
      super(dbConnection, mapper);
   }

   async getByClinicalRefCode(code: SystemCode): Promise<NutritionalRiskFactor[]> {
      try {
         const store = await this.getObjectStore();

         return new Promise((resolve, reject) => {
            const request = store.index("clinicalSignCode").getAll(code.unpack());

            request.onsuccess = (event) => {
               const results = (event.target as IDBRequest).result;
               if (!results || results.length === 0) {
                  resolve([]);
                  return;
               }

               const riskFactors = results.map((dto: NutritionalRiskFactorPersistenceDto) => this.mapper.toDomain(dto));
               resolve(riskFactors);
            };

            request.onerror = (event) => {
               console.error("Error fetching nutritional risk factors:", event);
               reject(new Error(`Failed to fetch nutritional risk factors for code ${code.unpack()}`));
            };
         });
      } catch (error) {
         console.error(error);
         throw new Error(`Failed to get nutritional risk factors by clinical code: ${error}`);
      }
   }
}
