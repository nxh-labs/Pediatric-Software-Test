import { handleError, left, Result, right, UseCase } from "@shared";
import { PatientMonitoringRepository } from "../../../../domain";
import { DeletePatientMonitoringRequest } from "./Request";
import { DeletePatientMonitoringResponse } from "./Response";

export class DeletePatientMonitoringUseCase implements UseCase<DeletePatientMonitoringRequest, DeletePatientMonitoringResponse> {
   constructor(private readonly repo: PatientMonitoringRepository) {}
   async execute(request: DeletePatientMonitoringRequest): Promise<DeletePatientMonitoringResponse> {
      try {
         const monitoring = await this.repo.getById(request.id);
         monitoring.delete();
         await this.repo.delete(monitoring.id);
         return right(Result.ok());
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
