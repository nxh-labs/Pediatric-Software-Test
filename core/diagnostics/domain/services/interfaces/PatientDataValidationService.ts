import { Result } from "@shared";
import { AnthropometricMeasure, BiochemicalReference, ClinicalSignReference, PatientDiagnosticData } from "../../models";
export interface ValidateResult {
   isValid: boolean;
   info?: {
      field: "Anthropometric" | "Clinical" | "Biochemical";
      fieldName: string;
      indication: string;
      error: string;
   };
}
export interface PatientValidationData {
   anthropometricMeasure: AnthropometricMeasure[];
   biochemicalReference: BiochemicalReference[];
   clinicalReference: ClinicalSignReference[];
}
   /**
    * @interface {IPatientDataValidationService} - S'occupe de la validation des données entrées par le patients
    * @private
    * validateAnthrop(PatientDiagnosticData,AnthropMeasure[])
    * validateBiological(PatientDiagnosticData,BiochemicalReference[]) ValidateResult
    * validateClinical(PatientDiagnosticData,ClinicalSignT[]) ValidateResult
    */
export interface IPatientDataValidationService {
   validate(patientData: PatientDiagnosticData, validationData: PatientValidationData): Result<ValidateResult>;
}
