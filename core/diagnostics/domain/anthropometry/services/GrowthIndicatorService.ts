import { Result, SystemCode } from "@shared";
import { AnthropometricData, Indicator, AnthropometricMeasure, GrowthIndicatorValue } from "../models";
import { IGrowthIndicatorService } from "./interfaces/GrowthIndicatorService";
import { EvaluationContext } from "../../common";

export class GrowthIndicatorService implements IGrowthIndicatorService {
   identifyPossibleIndicator(data: AnthropometricData, context: EvaluationContext): Promise<Result<Indicator[]>> {
      throw new Error("Method not implemented.");
   }
   getRequireMeasureForIndicator(indicatorCode: SystemCode): Promise<Result<AnthropometricMeasure[]>> {
      throw new Error("Method not implemented.");
   }
   calculateIndicator(data: AnthropometricData, indicatorCode: SystemCode, context: EvaluationContext): Promise<Result<GrowthIndicatorValue>> {
      throw new Error("Method not implemented.");
   }
   calculateAllIndicators(data: AnthropometricData, context: EvaluationContext): Promise<Result<GrowthIndicatorValue[]>> {
      throw new Error("Method not implemented.");
   }

