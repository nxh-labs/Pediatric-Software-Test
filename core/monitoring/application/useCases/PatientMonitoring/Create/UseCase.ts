import { AggregateID, GenerateUniqueId, handleError, left, Result, right, UseCase } from "@shared";
import { CreatePatientMonitoringRequest } from "./Request";
import { CreatePatientMonitoringResponse } from "./Response";
import { PatientACL, PatientMonitoring, PatientMonitoringRepository } from "../../../../domain";

export class CreatePatientMonitoringUseCase implements UseCase<CreatePatientMonitoringRequest, CreatePatientMonitoringResponse> {
   constructor(
      private readonly idGenerator: GenerateUniqueId,
      private readonly repo: PatientMonitoringRepository,
      private readonly patientAcl: PatientACL,
   ) {}
   async execute(request: CreatePatientMonitoringRequest): Promise<CreatePatientMonitoringResponse> {
      try {
         const patientValidationResult = await this.checkIfIsValidPatient(request.data.patientId);
         if (patientValidationResult.isFailure) return left(patientValidationResult);
         const monitoringId = this.idGenerator.generate().toValue();
         const patientMonitoringRes = PatientMonitoring.create({ patientId: request.data.patientId, visits: [] }, monitoringId);
         if (patientMonitoringRes.isFailure) return left(patientMonitoringRes);
         patientMonitoringRes.val.created();
         await this.repo.save(patientMonitoringRes.val);
         return right(Result.ok({ id: monitoringId }));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
   private async checkIfIsValidPatient(patientId: AggregateID): Promise<Result<boolean>> {
      try {
         const patient = await this.patientAcl.getPatientInfo(patientId);
         if (!patient) return Result.fail("Patient Not found. Please the diagnostic must be create for an existing patient");
         return Result.ok(true);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
