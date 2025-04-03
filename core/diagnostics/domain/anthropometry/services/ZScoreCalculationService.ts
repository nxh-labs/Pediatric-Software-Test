import { evaluateFormula, handleError, Result } from "@shared";
import { AnthropometricVariableObject } from "../common";
import { Indicator, GrowthReferenceChart, GrowthStandard } from "../models";
import { IZScoreCalculationService } from "./interfaces/ZScoreCalculationService";
import { ZScoreComputingStrategy } from "../policies/interfaces/ZScoreComputingStrategy";
import { GROWTH_INDICATOR_ERRORS, handleGrowthIndicatorError } from "../errors";

export class ZScoreCalculationService implements IZScoreCalculationService {
   constructor(private readonly strategies: ZScoreComputingStrategy[]) {}

   private findStrategy(indicator: Indicator, standard: GrowthStandard): ZScoreComputingStrategy | undefined {
      return this.strategies.find((strategy) => strategy.type === indicator.getZScoreComputingStrategyType() && strategy.standard === standard);
   }
   async calculateZScore(
      data: AnthropometricVariableObject,
      indicator: Indicator,
      chart: GrowthReferenceChart,
      standard: GrowthStandard,
   ): Promise<Result<number>> {
      try {
         const strategy = this.findStrategy(indicator, standard);
         if (!strategy) {
            return handleGrowthIndicatorError(
               GROWTH_INDICATOR_ERRORS.CALCULATION.STRATEGY_NOT_FOUND.path,
               `Indicator: ${indicator.getCode()} , Standard: ${standard}`,
            );
         }

         const axeX = evaluateFormula(indicator.getAxeX().value, data) as number;
         const axeY = evaluateFormula(indicator.getAxeY().value, data) as number;

         const zscore = strategy.computeZScore({
            measurements: { x: axeX, y: axeY },
            growthReferenceChart: chart,
         });

         if (isNaN(zscore)) {
            return handleGrowthIndicatorError(
               GROWTH_INDICATOR_ERRORS.CALCULATION.INVALID_RESULT.path,
               `ZScore : ${zscore}, Indicator: ${indicator.getCode()}, Chart: ${chart.getCode()}, Standard: ${standard}`,
            );
         }

         return Result.ok(zscore);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
