import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
   AddVisitToPatientMonitoringRequest,
   CreatePatientMonitoringRequest,
   DeletePatientMonitoringRequest,
   GetPatientMonitoringRequest,
   RemoveVisitFromPatientMonitoringRequest,
   UpdateVisitOnPatientMonitoringRequest,
} from "../../useCases";
import { PatientMonitoringDto } from "../../dtos";

export interface IPatientMonitoringService {
   create(req: CreatePatientMonitoringRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
   get(req: GetPatientMonitoringRequest): Promise<AppServiceResponse<PatientMonitoringDto> | Message>;
   addVisit(req: AddVisitToPatientMonitoringRequest): Promise<AppServiceResponse<boolean> | Message>;
   removeVisit(req: RemoveVisitFromPatientMonitoringRequest): Promise<AppServiceResponse<boolean> | Message>;
   updateVisit(req: UpdateVisitOnPatientMonitoringRequest): Promise<AppServiceResponse<boolean> | Message>;
   delete(req: DeletePatientMonitoringRequest): Promise<AppServiceResponse<boolean> | Message>;
}
