import { ValidateResult } from "../../core/services/interfaces/PatientDataValidationService";
import { AnthropometricData, GrowthIndicatorValue } from "../models";
import { IAnthropometricService } from "../ports";

export class AnthropometricService implements IAnthropometricService {
    validateMeasurements(data: AnthropometricData): Promise<ValidateResult> {
        throw new Error("Method not implemented.");
    }
    calculateGrowthIndicators(data: AnthropometricData): Promise<GrowthIndicatorValue[]> {
        throw new Error("Method not implemented.");
    }
    
}