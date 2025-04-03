import { Result, SystemCode } from "@shared";
import { AnthropometricMeasure, GrowthIndicatorValue, Indicator } from "../../models";
import { AnthropometricVariableObject } from "../../common";

export interface IGrowthIndicatorService {
   identifyPossibleIndicator(data: AnthropometricVariableObject): Promise<Result<Indicator[]>>;
   getRequireMeasureForIndicator(indicatorCode: SystemCode): Promise<Result<AnthropometricMeasure[]>>;
   calculateIndicator(data: AnthropometricVariableObject, indicatorCode: SystemCode,): Promise<Result<GrowthIndicatorValue>>;
   calculateAllIndicators(data: AnthropometricVariableObject): Promise<Result<GrowthIndicatorValue[]>>;
}
