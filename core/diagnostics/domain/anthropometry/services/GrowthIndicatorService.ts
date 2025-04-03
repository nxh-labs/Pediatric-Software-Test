import { ConditionResult, evaluateCondition, formatError, handleError, Result, SystemCode } from "@shared";
import { Indicator, AnthropometricMeasure, GrowthIndicatorValue, GrowthStandard, CreateGrowthIndicatorValueProps, StandardShape } from "../models";
import { IGrowthIndicatorService } from "./interfaces/GrowthIndicatorService";
import { AnthropometricMeasureRepository, GrowthReferenceChartRepository, IndicatorRepository } from "../ports";
import { ZScoreComputingStrategy } from "../policies/interfaces/ZScoreComputingStrategy";
import { AnthropometricVariableObject } from "../common";
import { IChartSelectionService } from "./interfaces/ChartSelectionService";
import { ChartSelectionService } from "./ChartSelectionService";
import { ZScoreCalculationService } from "./ZScoreCalculationService";
import { ZScoreInterpretationService } from "./ZScoreInterpretationService";
import { IZScoreCalculationService } from "./interfaces/ZScoreCalculationService";
import { IZScoreInterpretationService } from "./interfaces/ZScoreInterpretationService";

/**
 * @class GrowthIndicatorService
 * @implements {IGrowthIndicatorService}
 * @description Service responsible for managing and calculating growth indicators for anthropometric measurements
 * using WHO growth standards and other reference systems.
 */
export class GrowthIndicatorService implements IGrowthIndicatorService {
   private readonly chartService: IChartSelectionService;
   private readonly zScoreService: IZScoreCalculationService;
   private readonly interpretationService: IZScoreInterpretationService;

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
   ) {
      this.chartService = new ChartSelectionService(this.growthChartRepo)
      this.zScoreService = new ZScoreCalculationService(this.zScoreComputingStrategies)
      this.interpretationService = new ZScoreInterpretationService()
   }

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
         // 1. Select appropriate chart
         const chartResult = await this.chartService.selectChartForIndicator(data, indicator, standard);
         if (chartResult.isFailure) return Result.fail(formatError(chartResult, GrowthIndicatorService.name));

         // 2. Calculate z-score
         const zScoreResult = await this.zScoreService.calculateZScore(
            data,
            indicator,
            chartResult.val,
            standard
         );
         if (zScoreResult.isFailure) return Result.fail(formatError(zScoreResult, GrowthIndicatorService.name));

         // 3. Find interpretation
         const interpretationResult = await this.interpretationService.findInterpretation(
            data,
            zScoreResult.val,
            indicator
         );
         if (interpretationResult.isFailure) return Result.fail(formatError(interpretationResult, GrowthIndicatorService.name));
         // 4. Create Growth Indicator value 
         const growthIndicatorValueProps: CreateGrowthIndicatorValueProps = {
            code: indicator.getCode(),
            unit: "zscore",
            growthStandard: standard,
            referenceSource: StandardShape.CURVE,
            value: zScoreResult.val,
            interpretation: interpretationResult.val.unpack().code.unpack(),
            valueRange: interpretationResult.val.unpack().range
         }
         return GrowthIndicatorValue.create(growthIndicatorValueProps)
      } catch (e: unknown) {
         return handleError(e)
      }
   }
}
