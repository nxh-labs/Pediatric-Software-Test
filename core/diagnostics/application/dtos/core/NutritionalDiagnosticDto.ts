import { AggregateID } from "@shared";
import { PatientDiagnosticDataDto } from "./PatientDiagnosticDataDto";
import { NutritionalAssessmentResultDto } from "./NutritionalAssessmentResultDto";
import { DiagnosticModificationDto } from "./DiagnosticModificationDto";

export interface NutritionalDiagnosticDto {
   id: AggregateID;
   patientI: AggregateID;
   patientData: PatientDiagnosticDataDto;
   result?: NutritionalAssessmentResultDto;
   date: string;
   notes: string[];
   atInit: boolean;
   modificationHistories: DiagnosticModificationDto[];
   createAt: string;
   updatedAt: string;
}
