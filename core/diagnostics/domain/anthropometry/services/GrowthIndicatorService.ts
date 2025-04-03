import { ConditionResult, evaluateCondition, evaluateFormula, formatError, handleError, Result, SystemCode } from "@shared";
import { Indicator, AnthropometricMeasure, GrowthIndicatorValue, GrowthStandard, CreateGrowthIndicatorValueProps, StandardShape } from "../models";
import { IGrowthIndicatorService } from "./interfaces/GrowthIndicatorService";
import { AnthropometricMeasureRepository, GrowthReferenceChartRepository, IndicatorRepository } from "../ports";
import { ZScoreComputingStrategy } from "../policies/interfaces/ZScoreComputingStrategy";
import { AnthropometricVariableObject } from "../common";

/**
 * @class GrowthIndicatorService
 * @implements {IGrowthIndicatorService}
 * @description Service responsible for managing and calculating growth indicators for anthropometric measurements
 * using WHO growth standards and other reference systems.
 */
export class GrowthIndicatorService implements IGrowthIndicatorService {
   /**
    * @constructor
    * @param {AnthropometricMeasureRepository} anthropometricMeasureRepo - Repository for anthropometric measures
    * @param {IndicatorRepository} indicatorRepo - Repository for growth indicators
    * @param {GrowthReferenceChartRepository} growthChartRepo - Repository for growth reference charts
    * @param {ZScoreComputingStrategy[]} zScoreComputingStrategies - Array of strategies for computing z-scores
    */
   constructor(
      private anthropometricMeasureRepo: AnthropometricMeasureRepository,
      private indicatorRepo: IndicatorRepository,
      private growthChartRepo: GrowthReferenceChartRepository,
      private zScoreComputingStrategies: ZScoreComputingStrategy[]
   ) { }

   /**
    * @method identifyPossibleIndicator
    * @async
    * @param {AnthropometricVariableObject} data - Object containing anthropometric measurements
    * @returns {Promise<Result<Indicator[]>>} - Returns a Result containing an array of possible indicators
    * @description Identifies which growth indicators can be calculated based on available measurements
    */
   async identifyPossibleIndicator(data: AnthropometricVariableObject): Promise<Result<Indicator[]>> {
      try {
         const indicators = await this.indicatorRepo.getAll();
         const anthropDataMeasureCodes = Object.keys(data)
         const possibleIndicators: Indicator[] = [];
         for (const indicator of indicators) {
            const neededMeasureCodes = indicator.getMeasureCodes();
            for (const neededMeasureCode of neededMeasureCodes) {
               if (anthropDataMeasureCodes.includes(neededMeasureCode)) {
                  // anthropometric Data dispose des mesures necessaires pour utiliser cet Indicateur
                  // Verifions maintenant si le context est bon
                  const usageCondition = indicator.getUsageCondition();
                  const variableNames = usageCondition.variables;
                  if (!variableNames.every((variableName) => anthropDataMeasureCodes.includes(variableName))) {
                     return Result.fail("The context don't containt all needed variables");
                  }
                  const conditionResult = evaluateCondition<AnthropometricVariableObject>(usageCondition.value, data);
                  if (ConditionResult.True === conditionResult) possibleIndicators.push(indicator);
               }
            }
         }
         return Result.ok(possibleIndicators);
      } catch (e: unknown) {
         return handleError(e);
      }
   }

   /**
    * @method getRequireMeasureForIndicator
    * @async
    * @param {SystemCode} indicatorCode - The code of the indicator
    * @returns {Promise<Result<AnthropometricMeasure[]>>} - Returns required measurements for the indicator
    * @description Retrieves all measurements required to calculate a specific indicator
    */
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

   /**
    * @method calculateIndicator
    * @async
    * @param {AnthropometricVariableObject} data - Anthropometric measurements
    * @param {SystemCode} indicatorCode - The indicator to calculate
    * @param {GrowthStandard} standard - The growth standard to use (defaults to WHO)
    * @returns {Promise<Result<GrowthIndicatorValue>>} - Returns the calculated indicator value
    * @description Calculates a specific growth indicator for given measurements
    */
   async calculateIndicator(data: AnthropometricVariableObject, indicatorCode: SystemCode, standard: GrowthStandard = GrowthStandard.OMS): Promise<Result<GrowthIndicatorValue>> {
      try {
         const possibleIndicators = await this.identifyPossibleIndicator(data);
         if (possibleIndicators.isFailure) return Result.fail(formatError(possibleIndicators, GrowthIndicatorService.name));
         const indicator = possibleIndicators.val.find(indicator => indicator.getCode() === indicatorCode.unpack())
         if (!indicator) return Result.fail(`On ne peut pas calculer cette indicateur (${indicatorCode})pour ce patient`);
         return await this._calculateIndicator(data, indicator, standard)
      } catch (e: unknown) {
         return handleError(e)
      }
   }

   /**
    * @method calculateAllIndicators
    * @async
    * @param {AnthropometricVariableObject} data - Anthropometric measurements
    * @param {GrowthStandard} standard - The growth standard to use (defaults to WHO)
    * @returns {Promise<Result<GrowthIndicatorValue[]>>} - Returns all calculated indicator values
    * @description Calculates all possible indicators for given measurements
    */
   async calculateAllIndicators(data: AnthropometricVariableObject, standard: GrowthStandard = GrowthStandard.OMS): Promise<Result<GrowthIndicatorValue[]>> {
      try {
         const possibleIndicators = await this.identifyPossibleIndicator(data)
         if (possibleIndicators.isFailure) return Result.fail(formatError(possibleIndicators, GrowthIndicatorService.name));
         const growthIndicatorValueRes = await Promise.all(possibleIndicators.val.map(indicator => this._calculateIndicator(data, indicator, standard)))
         return Result.ok(growthIndicatorValueRes.map(res => res.val))
      } catch (e: unknown) {
         return handleError(e)
      }
   }

   private async _calculateIndicator(data: AnthropometricVariableObject, indicator: Indicator, standard: GrowthStandard = GrowthStandard.OMS): Promise<Result<GrowthIndicatorValue>> {
      try {
         const availableCharts = indicator.getAvailableCharts()
         const findedChart = availableCharts.find(availableChart => {
            const { condition } = availableChart
            if (!condition.unpack().variables.every(variableName => Object.keys(data).includes(variableName))) {
               return Result.fail("La variable pour verifier les conditions d'utilisation du GrowthChartReference n'est pas disponible")
            }
            const conditionResult = evaluateCondition(condition.unpack().value, { ...data, standard })
            if (conditionResult === ConditionResult.True) return true
            else return false
         })
         if (!findedChart) return Result.fail("Le growthChartReference Standard a utiliser pour ce indicateur n'est pas disponible");
         const growthChartReference = await this.growthChartRepo.getByCode(findedChart.chartCode)
         const findedStrategy = this.zScoreComputingStrategies.find(zscoreStrategy => zscoreStrategy.type === indicator.getZScoreComputingStrategyType() && zscoreStrategy.standard === standard);
         if (!findedStrategy) return Result.fail("La strategie de calcule de z score pour l'indicateur et le standard de reference utilise n'est pas disponible")
         const indicatorAxeX = evaluateFormula(indicator.getAxeX().value, data) as number
         const indicatorAxeY = evaluateFormula(indicator.getAxeY().value, data) as number
         const zscore = findedStrategy.computeZScore({
            measurements: { x: indicatorAxeX, y: indicatorAxeY },
            growthReferenceChart: growthChartReference
         })
         if (isNaN(zscore)) return Result.fail("Cette indicateur ne peut être calculer")
         const indicatorAvailableIntrepretation = indicator.getInterpretations()
         const findedInterpretation = indicatorAvailableIntrepretation.find(interpretation => {
            const { condition } = interpretation
            const conditionResult = evaluateCondition(condition.unpack().value, { ...data, z: zscore })
            if (conditionResult === ConditionResult.True) return true
            else return false
         })
         if (!findedInterpretation) return Result.fail("L'interpretation n'est pas trouvée pour ce z score")
         const growthIndicatorValueProps: CreateGrowthIndicatorValueProps = {
            code: indicator.getCode(),
            unit: "zscore",
            growthStandard: standard,
            referenceSource: StandardShape.CURVE,
            value: zscore,
            interpretation: findedInterpretation.code.unpack(),
            valueRange: findedInterpretation.range
         }
         return GrowthIndicatorValue.create(growthIndicatorValueProps)
      } catch (e: unknown) {
         return handleError(e)
      }
   }
}
