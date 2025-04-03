import { evaluateFormula, handleError, Result } from "@shared";
import { AnthropometricVariableObject } from "../common";
import { Indicator, GrowthReferenceChart, GrowthStandard } from "../models";
import { IZScoreCalculationService } from "./interfaces/ZScoreCalculationService";
import { ZScoreComputingStrategy } from "../policies/interfaces/ZScoreComputingStrategy";

export class ZScoreCalculationService implements IZScoreCalculationService {
    constructor(private readonly strategies: ZScoreComputingStrategy[]){}

    private findStrategy(
        indicator: Indicator,
        standard: GrowthStandard
      ): ZScoreComputingStrategy | undefined {
        return this.strategies.find(strategy => 
          strategy.type === indicator.getZScoreComputingStrategyType() && 
          strategy.standard === standard
        );
      }
   async calculateZScore(data: AnthropometricVariableObject, indicator: Indicator, chart: GrowthReferenceChart, standard: GrowthStandard): Promise<Result<number>> {
       try {
        const strategy = this.findStrategy(indicator, standard);
        if (!strategy) {
          return Result.fail(GROWTH_INDICATOR_ERRORS.STRATEGY_NOT_AVAILABLE);
        }
  
        const axeX = evaluateFormula(indicator.getAxeX().value, data) as number;
        const axeY = evaluateFormula(indicator.getAxeY().value, data) as number;
  
        const zscore = strategy.computeZScore({
          measurements: { x: axeX, y: axeY },
          growthReferenceChart: chart
        });
  
        if (isNaN(zscore)) {
          return Result.fail(GROWTH_INDICATOR_ERRORS.CALCULATION_FAILED);
        }
  
        return Result.ok(zscore);
     
       } catch (e:unknown) {
        return handleError(e)
       }
    }
    
}