import { Result, SystemCode } from "@shared";
import { AnthropometricData, AnthropometricMeasure, GrowthIndicatorValue, Indicator } from "../../models";
import { EvaluationContext } from "../../../common";

export interface IGrowthIndicatorService {
   identifyPossibleIndicator(data: AnthropometricData, context: EvaluationContext): Promise<Result<Indicator[]>>;
   getRequireMeasureForIndicator(indicatorCode: SystemCode): Promise<Result<AnthropometricMeasure[]>>;
   calculateIndicator(data: AnthropometricData, indicatorCode: SystemCode, context: EvaluationContext): Promise<Result<GrowthIndicatorValue>>;
   calculateAllIndicators(data: AnthropometricData, context: EvaluationContext): Promise<Result<GrowthIndicatorValue[]>>;
}
