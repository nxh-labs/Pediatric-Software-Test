import { formatError, GenerateUniqueId, handleError, left, Result, right, UseCase } from "@shared";
import { AddVisitToPatientMonitoringRequest } from "./Request";
import { AddVisitToPatientMonitoringResponse } from "./Response";
import { MeasurementValidationACL, PatientMonitoring, PatientMonitoringRepository, Visit } from "../../../../domain";

export class AddVisitToPatientMonitoringUseCase implements UseCase<AddVisitToPatientMonitoringRequest, AddVisitToPatientMonitoringResponse> {
   constructor(
      private readonly idGenerator: GenerateUniqueId,
      private readonly repo: PatientMonitoringRepository,
      private readonly measurementAcl: MeasurementValidationACL,
   ) {}
   async execute(request: AddVisitToPatientMonitoringRequest): Promise<AddVisitToPatientMonitoringResponse> {
      try {
         const patientMonitoring = await this.repo.getById(request.patientMonitoringId);
         const visitRes = await this.createAndValidateVisit(patientMonitoring, request.visitData);
         if (visitRes.isFailure) return left(visitRes);
         patientMonitoring.addVisit(visitRes.val);
         await this.repo.save(patientMonitoring);
         return right(Result.ok());
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
   private async createAndValidateVisit(
      monitoring: PatientMonitoring,
      data: AddVisitToPatientMonitoringRequest["visitData"],
   ): Promise<Result<Visit>> {
      try {
         const visitRes = Visit.create(data.data, this.idGenerator.generate().toValue());
         if (visitRes.isFailure) return Result.fail(formatError(visitRes, AddVisitToPatientMonitoringUseCase.name));
         const validateMeasurementRes = await this.measurementAcl.validate(monitoring.getPatientId(), visitRes.val.getProps().measurement);
         if (validateMeasurementRes.isFailure) return Result.fail(formatError(validateMeasurementRes, AddVisitToPatientMonitoringUseCase.name));
         return Result.ok(visitRes.val);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
