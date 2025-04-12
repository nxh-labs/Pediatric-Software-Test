import { AggregateID, formatError, handleError, left, Result, right, UseCase } from "@shared";
import { UpdateVisitOnPatientMonitoringRequest } from "./Request";
import { UpdateVisitOnPatientMonitoringResponse } from "./Response";
import { ObservationNote, PatientMonitoring, PatientMonitoringRepository, Visit, VisitMeasurement, VisitPurpose } from "../../../../domain";

export class UpdateVisitOnPatientMonitoringUseCase implements UseCase<UpdateVisitOnPatientMonitoringRequest, UpdateVisitOnPatientMonitoringResponse> {
   constructor(private readonly repo: PatientMonitoringRepository) {}
   async execute(request: UpdateVisitOnPatientMonitoringRequest): Promise<UpdateVisitOnPatientMonitoringResponse> {
      try {
         const patientMonitoring = await this.repo.getById(request.patientMonitoringId);
         const visit = this.getVisit(patientMonitoring, request.visitId);
         if (!visit) {
            return left(
               Result.fail(
                  `The visit with id ${request.visitId} not found in patient monitoring with id ${
                     request.patientMonitoringId
                  } of patient ${patientMonitoring.getPatientId()}`,
               ),
            );
         }

         const updatedRes = this.updateVisit(visit, request.data);
         if (updatedRes.isFailure) return left(updatedRes);
         patientMonitoring.addVisit(visit);
         await this.repo.save(patientMonitoring);
         return right(Result.ok());
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
   private getVisit(patientMonitoring: PatientMonitoring, visitId: AggregateID): Visit | undefined {
      const visits = patientMonitoring.getProps().visits;
      return visits.find((visit) => visit.id === visitId);
   }
   private updateVisit(visit: Visit, data: UpdateVisitOnPatientMonitoringRequest["data"]): Result<void> {
      try {
         if (data.notes) {
            const notesRes = data.notes.map(ObservationNote.create);
            const combinedRes = Result.combine(notesRes);
            if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, UpdateVisitOnPatientMonitoringUseCase.name));
            visit.changeNotes(notesRes.map((res) => res.val));
         }

         if (data.visitPurpose) {
            const purposeRes = VisitPurpose.create(data.visitPurpose);
            if (purposeRes.isFailure) return Result.fail(formatError(purposeRes, UpdateVisitOnPatientMonitoringUseCase.name));
            visit.changePurpose(purposeRes.val);
         }
         if (data.observerId) {
            visit.changeObserverId(data.observerId);
         }
         if (data.measurement) {
            const visitMeasurementRes = VisitMeasurement.create(data.measurement);
            if (visitMeasurementRes.isFailure) return Result.fail(formatError(visitMeasurementRes, UpdateVisitOnPatientMonitoringUseCase.name));
            visit.changeMeasurement(visitMeasurementRes.val);
         }
         return Result.ok();
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
