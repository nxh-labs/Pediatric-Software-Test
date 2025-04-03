import { formatError, handleError, Result } from "@shared";
import { EvaluationContext, ValidateResult } from "../../common";
import { AnthropEntry, AnthropometricData, AnthroSystemCodes, DAY_IN_TWO_YEARS, GrowthIndicatorValue } from "../models";
import { AnthropometricMeasureRepository, IAnthropometricService, UnitAcl } from "../ports";
import { IGrowthIndicatorService } from "./interfaces/GrowthIndicatorService";
import { AnthropometricVariableObject } from "../common";

export class AnthropometricService implements IAnthropometricService {
   constructor(private anthropMeasureRepo: AnthropometricMeasureRepository, private growthIndicatorService: IGrowthIndicatorService, private unitAcl: UnitAcl) { }
   async generateAnthropometricVariableObject(data: AnthropometricData, context: EvaluationContext): Promise<Result<AnthropometricVariableObject>> {
      try {
         const anthropData = data.unpack();
         const anthropometricVariableObject: AnthropometricVariableObject = {
            [AnthroSystemCodes.AGE_IN_DAY]: context.age_in_day,
            [AnthroSystemCodes.SEX]: context.sex,
            [AnthroSystemCodes.AGE_IN_MONTH]: context.age_in_month
         };
         for (const anthroMeasure of anthropData) {
            const measureCode = anthroMeasure.code.unpack();
            if (Object.values(AnthroSystemCodes).includes(measureCode as AnthroSystemCodes)) {

               const anthropometricMeasure = await this.anthropMeasureRepo.getByCode(anthroMeasure.code);
               // Si c'est les memes unitées, on peut continuer le calcule 
               if (anthropometricMeasure.getUnits().defaultUnit === anthroMeasure.unit.unpack()) {
                  anthropometricVariableObject[measureCode as AnthroSystemCodes] = anthroMeasure.value;
               } else {
                  // Convertir la valeur avant d'assigner a anthropometricVaribaleOject 
                  const convertedValueRes = await this.unitAcl.convertTo(anthroMeasure.unit, anthropometricMeasure.getProps().unit, anthroMeasure.value)
                  if (convertedValueRes.isFailure) return Result.fail(formatError(convertedValueRes, AnthropometricService.name));
                  anthropometricVariableObject[measureCode as AnthroSystemCodes] = convertedValueRes.val
               }

               if (measureCode === AnthroSystemCodes.HEIGHT || measureCode === AnthroSystemCodes.LENGTH) {
                  anthropometricVariableObject[AnthroSystemCodes.LENHEI] = this.ajusteLenHei(anthroMeasure, anthropometricVariableObject)
               }
            }
         }
         return Result.ok(anthropometricVariableObject)
      } catch (e: unknown) {
         return handleError(e)
      }
   }
   validateMeasurements(data: AnthropometricData, context: EvaluationContext): Promise<Result<ValidateResult>> {
      throw new Error("Method not implemented.");
   }
   calculateGrowthIndicators(data: AnthropometricData, context: EvaluationContext): Promise<Result<GrowthIndicatorValue[]>> {
      throw new Error("Method not implemented.");
   }

   private ajusteLenHei(anthroMeasure: AnthropEntry, anthropometricVariableObject: AnthropometricVariableObject): number {
      const age_in_days = Math.ceil(anthropometricVariableObject[AnthroSystemCodes.AGE_IN_DAY] as number);
      // Si enfant <= 730 jours et mesure "h", on ajoute 0.7
      if (age_in_days < DAY_IN_TWO_YEARS && anthroMeasure.code.unpack() === AnthroSystemCodes.HEIGHT) return (anthropometricVariableObject[AnthroSystemCodes.HEIGHT] as number) + 0.7;
      // Si enfant > 730 jours et mesure "l", on soustrait 0.7
      if (age_in_days >= DAY_IN_TWO_YEARS && anthroMeasure.code.unpack() === AnthroSystemCodes.LENGTH) return (anthropometricVariableObject[AnthroSystemCodes.LENGTH] as number) - 0.7;
      return (anthroMeasure.code.unpack() === AnthroSystemCodes.HEIGHT ? anthropometricVariableObject[AnthroSystemCodes.HEIGHT] : anthropometricVariableObject[AnthroSystemCodes.LENGTH]) as number
   }
}
