import { AggregateID, CreatePropsDto } from "@shared";
import { VisitDto } from "../../../dtos";

export type AddVisitToPatientMonitoringRequest = {
   patientMonitoringId: AggregateID;
   visitData: CreatePropsDto<VisitDto>;
};
