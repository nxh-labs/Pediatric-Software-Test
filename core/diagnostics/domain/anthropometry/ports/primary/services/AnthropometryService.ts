import { ValidateResult } from "../../../../core/services/interfaces/PatientDataValidationService";
import { AnthropometricData, GrowthIndicatorValue } from "../../../models";

export interface IAnthropometricService {
   validateMeasurements(data: AnthropometricData): Promise<ValidateResult>;
   calculateGrowthIndicators(data: AnthropometricData): Promise<GrowthIndicatorValue[]>;
}
