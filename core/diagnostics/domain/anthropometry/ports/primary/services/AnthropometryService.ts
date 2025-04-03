import { Result } from "@shared";
import { EvaluationContext, ValidateResult } from "../../../../common";
import { AnthropometricData } from "../../../models";
import { AnthropometricVariableObject } from "../../../common";

export interface IAnthropometricService {
   validateMeasurements(data: AnthropometricData, context: EvaluationContext): Promise<Result<ValidateResult>>;
   generateAnthropometricVariableObject(data: AnthropometricData, context: EvaluationContext): Promise<Result<AnthropometricVariableObject>>;
}
