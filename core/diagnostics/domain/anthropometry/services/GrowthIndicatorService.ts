import { ConditionResult, evaluateCondition, formatError, handleError, Result, SystemCode } from "@shared";
import { AnthropometricData, Indicator, AnthropometricMeasure, GrowthIndicatorValue } from "../models";
import { IGrowthIndicatorService } from "./interfaces/GrowthIndicatorService";
import { EvaluationContext } from "../../common";
import { AnthropometricMeasureRepository, GrowthReferenceChartRepository, IndicatorRepository } from "../ports";

export class GrowthIndicatorService implements IGrowthIndicatorService {
   constructor(
      private anthropometricMeasureRepo: AnthropometricMeasureRepository,
      private indicatorRepo: IndicatorRepository,
      private growthChartRepo: GrowthReferenceChartRepository,
   ) {}
   /**
    * @method identifyPossibleIndicator -
    * @param data {AnthropometricData} - C'est un tableau des données anthropométriques a utilise
    * @param context {EvaluationContext}
    */
   async identifyPossibleIndicator(data: AnthropometricData, context: EvaluationContext): Promise<Result<Indicator[]>> {
      try {
         const indicators = await this.indicatorRepo.getAll();
         const anthropDataMeasureCodes = data.unpack().map((anthropEntry) => anthropEntry.code.unpack());
         const possibleIndicators: Indicator[] = [];
         for (const indicator of indicators) {
            const neededMeasureCodes = indicator.getMeasureCodes();
            for (const neededMeasureCode of neededMeasureCodes) {
               if (anthropDataMeasureCodes.includes(neededMeasureCode)) {
                  // anthropometric Data dispose des mesures necessaires pour utiliser cet Indicateur
                  // Verifions maintenant si le context est bon
                  const usageCondition = indicator.getUsageCondition();
                  const variableNames = usageCondition.variables;
                  if (variableNames.every((variableName) => Object.keys(context).includes(variableName))) {
                     return Result.fail("The context don't containt all needed variables");
                  }
                  const conditionResult = evaluateCondition<EvaluationContext>(usageCondition.value, context);
                  if (ConditionResult.True === conditionResult) possibleIndicators.push(indicator);
               }
            }
         }
         return Result.ok(possibleIndicators);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
   async getRequireMeasureForIndicator(indicatorCode: SystemCode): Promise<Result<AnthropometricMeasure[]>> {
      try {
         const indicator = await this.indicatorRepo.getByCode(indicatorCode);
         const neededMeasureCodes = indicator.getProps().neededMeasureCodes;
         const anthropometricMeasures = await Promise.all(neededMeasureCodes.map((code) => this.anthropometricMeasureRepo.getByCode(code)));
         return Result.ok(anthropometricMeasures);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
   async calculateIndicator(data: AnthropometricData, indicatorCode: SystemCode, context: EvaluationContext): Promise<Result<GrowthIndicatorValue>> {
     try {
        const possibleIndicators = await this.identifyPossibleIndicator(data,context);
        if(possibleIndicators.isFailure) return Result.fail(formatError(possibleIndicators,GrowthIndicatorService.name));
        const indicator = possibleIndicators.val.find(indicator => indicator.getCode() === indicatorCode.unpack())
        if(!indicator) return Result.fail("On ne peut pas calculer cette indicateur pour ce patient");
        
     } catch (e:unknown) {
      return handleError(e)
     }
   }
   calculateAllIndicators(data: AnthropometricData, context: EvaluationContext): Promise<Result<GrowthIndicatorValue[]>> {
      throw new Error("Method not implemented.");
   }
}
