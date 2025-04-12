import { AggregateID } from "@shared";

export type RemoveVisitFromPatientMonitoringRequest = {
   patientMonitoringId: AggregateID;
   visitId: AggregateID;
};
