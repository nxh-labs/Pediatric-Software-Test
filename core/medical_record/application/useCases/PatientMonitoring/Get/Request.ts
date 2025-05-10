import { AggregateID } from "@shared";

export type GetPatientMonitoringRequest = {
   id?: AggregateID;
   patientId?: AggregateID;
};
