import { Result } from "@shared";
import { PatientDiagnosticData } from "../../../models";
import { ValidateResult } from "../../../../common";

   /**
    * @interface {IPatientDataValidationService} - S'occupe de la validation des données entrées par le patients
    * @private
    * validateAnthrop(PatientDiagnosticData,AnthropMeasure[])
    * validateBiological(PatientDiagnosticData,BiochemicalReference[]) ValidateResult
    * validateClinical(PatientDiagnosticData,ClinicalSignT[]) ValidateResult
    */
export interface IPatientDataValidationService {
   validate(patientData: PatientDiagnosticData): Result<ValidateResult>;
}
