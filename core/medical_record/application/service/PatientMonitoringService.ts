/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import {
   AddVisitToPatientMonitoringRequest,
   AddVisitToPatientMonitoringResponse,
   CreatePatientMonitoringRequest,
   CreatePatientMonitoringResponse,
   DeletePatientMonitoringRequest,
   DeletePatientMonitoringResponse,
   GetPatientMonitoringRequest,
   RemoveVisitFromPatientMonitoringRequest,
   RemoveVisitFromPatientMonitoringResponse,
   UpdateVisitOnPatientMonitoringRequest,
   UpdateVisitOnPatientMonitoringResponse,
} from "../useCases";
import { GetPatientMonitoringResponse } from "../useCases/PatientMonitoring/Get/Response";
import { IPatientMonitoringService } from "./interface";
import { PatientMonitoringDto } from "../dtos";

export interface PatientMonitoringServiceUseCases {
   createUC: UseCase<CreatePatientMonitoringRequest, CreatePatientMonitoringResponse>;
   getUC: UseCase<GetPatientMonitoringRequest, GetPatientMonitoringResponse>;
   addVisitUC: UseCase<AddVisitToPatientMonitoringRequest, AddVisitToPatientMonitoringResponse>;
   removeVisitUC: UseCase<RemoveVisitFromPatientMonitoringRequest, RemoveVisitFromPatientMonitoringResponse>;
   updateVisitUC: UseCase<UpdateVisitOnPatientMonitoringRequest, UpdateVisitOnPatientMonitoringResponse>;
   deleteUC: UseCase<DeletePatientMonitoringRequest, DeletePatientMonitoringResponse>;
}

export class PatientMonitoringService implements IPatientMonitoringService {
   constructor(private readonly ucs: PatientMonitoringServiceUseCases) {}
   async create(req: CreatePatientMonitoringRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
      const res = await this.ucs.createUC.execute(req);
      if (res.isRight()) return { data: res.value.val };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
   async get(req: GetPatientMonitoringRequest): Promise<AppServiceResponse<PatientMonitoringDto> | Message> {
      const res = await this.ucs.getUC.execute(req);
      if (res.isRight()) return { data: res.value.val };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
   async addVisit(req: AddVisitToPatientMonitoringRequest): Promise<AppServiceResponse<boolean> | Message> {
      const res = await this.ucs.addVisitUC.execute(req);
      if (res.isRight()) return { data: true };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
   async removeVisit(req: RemoveVisitFromPatientMonitoringRequest): Promise<AppServiceResponse<boolean> | Message> {
      const res = await this.ucs.removeVisitUC.execute(req);
      if (res.isRight()) return { data: true };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
   async updateVisit(req: UpdateVisitOnPatientMonitoringRequest): Promise<AppServiceResponse<boolean> | Message> {
      const res = await this.ucs.updateVisitUC.execute(req);
      if (res.isRight()) return { data: true };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
   async delete(req: DeletePatientMonitoringRequest): Promise<AppServiceResponse<boolean> | Message> {
      const res = await this.ucs.deleteUC.execute(req);
      if (res.isRight()) return { data: true };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
}
