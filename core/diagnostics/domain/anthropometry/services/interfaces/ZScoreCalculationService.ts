import { Result } from "@shared";
import { AnthropometricVariableObject } from "../../common";
import { GrowthReferenceChart, GrowthStandard, Indicator } from "../../models";

export interface IZScoreCalculationService { 
    calculateZScore(data: AnthropometricVariableObject, indicator: Indicator,chart: GrowthReferenceChart,standard: GrowthStandard): Promise<Result<number>>;
}