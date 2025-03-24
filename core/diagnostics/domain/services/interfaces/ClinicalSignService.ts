import { Result } from "@shared";
import { ClinicalSignReference, MicronutrientDeficiency, PatientDiagnosticData } from "../../models";

export interface IClinicalSignService {
   identifyPossibleSign(patientDiagnosticData: PatientDiagnosticData): Promise<Result<ClinicalSignReference[]>>;
   getSuspectedNutrients(patientDiagnosticData: PatientDiagnosticData): Promise<Result<MicronutrientDeficiency[]>>;
}
