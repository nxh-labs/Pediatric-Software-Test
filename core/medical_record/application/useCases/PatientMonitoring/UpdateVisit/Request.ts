import { AggregateID } from "@shared";
import { VisitDto } from "../../../dtos";

export type UpdateVisitOnPatientMonitoringRequest = {
   patientMonitoringId: AggregateID;
   visitId: AggregateID;
   data: Partial<Omit<VisitDto, "id" | "createdAt" | "updatedAt">>;
};
