import { Birthday, Entity, EntityPropsBaseType, Gender } from "@shared";
import {
  AnthropometricData,
  BiologicalTestResult,
  ClinicalData,
} from "../valueObjects";

export interface IPatientDiagnosticData extends EntityPropsBaseType {
  gender: Gender;
  birthday: Birthday;
  anthropMeasures: AnthropometricData;
  clinicalSigns: ClinicalData;
  biologicalTestResults: BiologicalTestResult[];
}

export class PatientDiagnosticData extends Entity<IPatientDiagnosticData> {
  public validate(): void {
    throw new Error("Method not implemented.");
  }
}
