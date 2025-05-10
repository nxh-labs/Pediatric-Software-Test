import { AggregateID } from "@shared";
import { VisitDto } from "./VisitDto";

export interface PatientMonitoringDto {
   id: AggregateID;
   patientId: AggregateID;
   visits: VisitDto[];
   createdAt: string;
   updatedAt: string;
}
