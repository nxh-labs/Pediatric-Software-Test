import { handleError, Result } from "@shared";
import { EvaluationContext, ValidateResult } from "../../common";
import { AnthropEntry, AnthropometricData, AnthroSystemCodes, DAY_IN_TWO_YEARS, GrowthIndicatorValue } from "../models";
import { AnthropometricVariableObject, IAnthropometricService } from "../ports";
import { IGrowthIndicatorService } from "./interfaces/GrowthIndicatorService";

export class AnthropometricService implements IAnthropometricService {
   constructor(private growthIndicatorService: IGrowthIndicatorService) { }
   async generateAnthropometricVariableObject(data: AnthropometricData, context: EvaluationContext): Promise<Result<AnthropometricVariableObject>> {
      try {
         const anthropData = data.unpack();
         const anthropometricVariableObject: AnthropometricVariableObject = {
            [AnthroSystemCodes.AGE_IN_DAY]: context.age_in_day,
            [AnthroSystemCodes.SEX]: context.sex
         };
         for (const anthroMeasure of anthropData) {
            const measureCode = anthroMeasure.code.unpack();
            if (Object.values(AnthroSystemCodes).includes(measureCode as AnthroSystemCodes)) {
               anthropometricVariableObject[measureCode as AnthroSystemCodes] = anthroMeasure.value;
               if (measureCode === AnthroSystemCodes.HEIGHT || measureCode === AnthroSystemCodes.LENGTH) {
                  anthropometricVariableObject[AnthroSystemCodes.LENHEI] = this.ajusteLenHei(anthroMeasure, context)
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

   private ajusteLenHei(anthroMeasure: AnthropEntry, context: EvaluationContext): number {
      const age_in_days = Math.ceil(context.age_in_day);
      // Si enfant <= 730 jours et mesure "h", on ajoute 0.7
      if (age_in_days < DAY_IN_TWO_YEARS && anthroMeasure.code.unpack() === AnthroSystemCodes.HEIGHT) return anthroMeasure.value + 0.7;
      // Si enfant > 730 jours et mesure "l", on soustrait 0.7
      if (age_in_days >= DAY_IN_TWO_YEARS && anthroMeasure.code.unpack() === AnthroSystemCodes.LENGTH) return anthroMeasure.value - 0.7;
      return anthroMeasure.value;
   }
}
