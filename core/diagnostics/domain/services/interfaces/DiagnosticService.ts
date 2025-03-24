import { Result } from "@shared";
import { PatientDiagnosticData, PatientDiagnosticResult } from "../../models";

export interface IDiagnosticService {
   makeDiagnostic(patientData: PatientDiagnosticData): Promise<Result<PatientDiagnosticResult>>;
}
