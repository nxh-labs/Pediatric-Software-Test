import { handleError, left, Result, right, UseCase } from "@shared";
import { RemoveVisitFromPatientMonitoringRequest } from "./Request";
import { RemoveVisitFromPatientMonitoringResponse } from "./Response";
import { PatientMonitoringRepository } from "../../../../domain";

export class RemoveVisitFromPatientMonitoringUseCase
   implements UseCase<RemoveVisitFromPatientMonitoringRequest, RemoveVisitFromPatientMonitoringResponse>
{
   constructor(private readonly repo: PatientMonitoringRepository) {}
   async execute(request: RemoveVisitFromPatientMonitoringRequest): Promise<RemoveVisitFromPatientMonitoringResponse> {
      try {
         const monitoring = await this.repo.getById(request.patientMonitoringId);
         monitoring.removeVisit(request.visitId);
         await this.repo.save(monitoring);
         return right(Result.ok());
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
