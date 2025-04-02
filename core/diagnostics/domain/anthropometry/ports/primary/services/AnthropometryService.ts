import { Result, Sex } from "@shared";
import { EvaluationContext, ValidateResult } from "../../../../common";
import { AnthropometricData, AnthroSystemCodes, GrowthIndicatorValue } from "../../../models";
export type AnthropometricVariableObject = Partial<Record<AnthroSystemCodes,Sex|number>>
export interface IAnthropometricService {
   validateMeasurements(data: AnthropometricData, context: EvaluationContext): Promise<Result<ValidateResult>>;
   generateAnthropometricVariableObject(
      data: AnthropometricData,
      context: EvaluationContext,
   ): Promise<Result<AnthropometricVariableObject>>;
   calculateGrowthIndicators(data: AnthropometricData, context: EvaluationContext): Promise<Result<GrowthIndicatorValue[]>>;
}
