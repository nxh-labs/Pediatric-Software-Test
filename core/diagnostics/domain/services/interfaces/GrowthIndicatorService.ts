import { Result, SystemCode } from "@shared";
import { AnthropometricMeasure, GrowthIndicatorValue, Indicator, PatientDiagnosticData } from "../../models";

export interface IGrowthIndicatorService {
   identifyPossibleIndicator(patientDiagnosticData: PatientDiagnosticData): Promise<Result<Indicator[]>>;
   getRequireMeasureForIndicator(indicatorCode: SystemCode): Promise<Result<AnthropometricMeasure[]>>;
   calculateIndicator(patientDiagnosticData: PatientDiagnosticData, indicatorCode: SystemCode): Promise<Result<GrowthIndicatorValue>>;
   calculateAllIndicators(patientDiagnosticData: PatientDiagnosticData): Promise<Result<GrowthIndicatorValue[]>>;
}
