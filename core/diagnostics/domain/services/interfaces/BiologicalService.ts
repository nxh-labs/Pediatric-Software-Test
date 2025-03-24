import { Result } from "@shared";
import { BiochemicalReference, BiologicalAnalysisInterpretation, PatientDiagnosticData } from "../../models";

export interface IBiologicalService {
   identifyPossibleSign(patientDiagnosticData: PatientDiagnosticData): Promise<Result<BiochemicalReference[]>>;
   getBiologicalAnalysisInterpretation(patientDiagnosticData: PatientDiagnosticData): Promise<Result<BiologicalAnalysisInterpretation[]>>;
}
