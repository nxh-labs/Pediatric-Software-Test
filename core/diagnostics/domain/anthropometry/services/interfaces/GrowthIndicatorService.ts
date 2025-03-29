import { Result, SystemCode } from "@shared";
import { AnthropometricData, AnthropometricMeasure, GrowthIndicatorValue, Indicator } from "../../models";

export interface IGrowthIndicatorService {
   identifyPossibleIndicator(data: AnthropometricData): Promise<Result<Indicator[]>>;
   getRequireMeasureForIndicator(indicatorCode: SystemCode): Promise<Result<AnthropometricMeasure[]>>;
   calculateIndicator(data: AnthropometricData, indicatorCode: SystemCode): Promise<Result<GrowthIndicatorValue>>;
   calculateAllIndicators(data: AnthropometricData): Promise<Result<GrowthIndicatorValue[]>>;
}
