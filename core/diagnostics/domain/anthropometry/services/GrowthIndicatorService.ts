import { Result, SystemCode } from "@shared";
import { AnthropometricData, Indicator, AnthropometricMeasure, GrowthIndicatorValue } from "../models";
import { IGrowthIndicatorService } from "./interfaces/GrowthIndicatorService";

export class GrowthIndicatorService implements IGrowthIndicatorService {
   identifyPossibleIndicator(data: AnthropometricData): Promise<Result<Indicator[]>> {
      throw new Error("Method not implemented.");
   }
   getRequireMeasureForIndicator(indicatorCode: SystemCode): Promise<Result<AnthropometricMeasure[]>> {
      throw new Error("Method not implemented.");
   }
   calculateIndicator(data: AnthropometricData, indicatorCode: SystemCode): Promise<Result<GrowthIndicatorValue>> {
      throw new Error("Method not implemented.");
   }
   calculateAllIndicators(data: AnthropometricData): Promise<Result<GrowthIndicatorValue[]>> {
      throw new Error("Method not implemented.");
   }
}
