import { Result } from "@shared";
import { AnthropometricVariableObject } from "../../common";
import { GrowthReferenceChart, GrowthStandard, Indicator } from "../../models";

export interface IChartSelectionService {
    selectChartForIndicator(data: AnthropometricVariableObject,indicator: Indicator,standard: GrowthStandard): Promise<Result<GrowthReferenceChart>>;
}