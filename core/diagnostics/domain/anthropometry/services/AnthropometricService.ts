
import { Result } from "@shared";
import { EvaluationContext, ValidateResult } from "../../common";
import { AnthropometricData, GrowthIndicatorValue } from "../models";
import { IAnthropometricService } from "../ports";
import { IGrowthIndicatorService } from "./interfaces/GrowthIndicatorService";

export class AnthropometricService implements IAnthropometricService {
    constructor(private growthIndicatorService:IGrowthIndicatorService) {}
    validateMeasurements(data: AnthropometricData, context: EvaluationContext): Promise<Result<ValidateResult>> {
        throw new Error("Method not implemented.");
    }
    calculateGrowthIndicators(data: AnthropometricData, context: EvaluationContext): Promise<Result<GrowthIndicatorValue[]>> {
        throw new Error("Method not implemented.");
    }
   
    
}