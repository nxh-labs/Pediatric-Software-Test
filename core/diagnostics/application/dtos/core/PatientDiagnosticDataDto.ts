import { AggregateID } from "@shared";
import { AnthropometricDataDto } from "../anthropometric";
import { ClinicalSignDto } from "../clinical";
import { EdemaData } from "../../../domain";
import { BiologicalTestResultDto } from "../biological";

export interface PatientDiagnosticDataDto {
   id: AggregateID;
   patientId: AggregateID;
   anthropometricData: AnthropometricDataDto;
   clinicalData: {
      edema: ClinicalSignDto<EdemaData>;
      othersSigns: ClinicalSignDto<object>[];
   };
   biologicalTestResults: BiologicalTestResultDto[];
   createdAt: string;
   updatedAt: string;
}
