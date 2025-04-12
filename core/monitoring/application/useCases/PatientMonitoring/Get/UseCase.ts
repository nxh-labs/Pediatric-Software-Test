import { ApplicationMapper, handleError, left, Result, right, UseCase } from "@shared";
import { GetPatientMonitoringRequest } from "./Request";
import { GetPatientMonitoringResponse } from "./Response";
import { PatientMonitoring, PatientMonitoringRepository } from "../../../../domain";
import { PatientMonitoringDto } from "../../../dtos";

export class GetPatientMonitoringUseCase implements UseCase<GetPatientMonitoringRequest, GetPatientMonitoringResponse> {
   constructor(
      private readonly repo: PatientMonitoringRepository,
      private readonly mapper: ApplicationMapper<PatientMonitoring, PatientMonitoringDto>,
   ) {}
   async execute(request: GetPatientMonitoringRequest): Promise<GetPatientMonitoringResponse> {
      try {
         const monitoring = request.id
            ? await this.repo.getById(request.id)
            : request.patientId
            ? await this.repo.getByPatientId(request.patientId)
            : null;
         if (!monitoring) return left(Result.fail("Please provide id or patient id to get patient monitoring."));
         return right(Result.ok(this.mapper.toResponse(monitoring)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
