import { Result } from "@shared";
import { EvaluationContext, ValidateResult } from "../../../../common";
import { AnthropometricData, GrowthIndicatorValue } from "../../../models";

export interface IAnthropometricService {
   validateMeasurements(data: AnthropometricData, context: EvaluationContext): Promise<Result<ValidateResult>>;
   calculateGrowthIndicators(data: AnthropometricData, context: EvaluationContext): Promise<Result<GrowthIndicatorValue[]>>;
}
