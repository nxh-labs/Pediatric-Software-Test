/* eslint-disable @typescript-eslint/no-explicit-any */
import { bindEventHandler, DomainEventMessage, EventHandler, EventHandlerExecutionFailed, UseCase } from "@shared";
import { PatientDeletedData, PatientDeletedEvent } from "../../../patient";
import { DeletePatientMonitoringRequest, DeletePatientMonitoringResponse, GetPatientMonitoringRequest } from "../useCases";
import { GetPatientMonitoringResponse } from "../useCases/PatientMonitoring/Get/Response";

@DomainEventMessage("After Patient Deleted, On Monitoring Bc, Delete associated Patient Monitoring", true)
export class AfterPatientDeletedEventOnMonitoring extends EventHandler<PatientDeletedData, PatientDeletedEvent> {
   constructor(
      private readonly getMonitoring: UseCase<GetPatientMonitoringRequest, GetPatientMonitoringResponse>,
      private readonly deleteMonitoring: UseCase<DeletePatientMonitoringRequest, DeletePatientMonitoringResponse>,
      priority?: number,
   ) {
      super(priority);
   }
   async execute(event: PatientDeletedEvent): Promise<void> {
      await this.onPatientDeletedEvent(event.data);
   }
   private async onPatientDeletedEvent(eventData: PatientDeletedData) {
      const monitoringRes = await this.getMonitoring.execute({ patientId: eventData.id });
      if (monitoringRes.isRight()) {
         const monitoringId = monitoringRes.value.val.id;
         const deleteMonitoring = await this.deleteMonitoring.execute({ id: monitoringId });
         if (deleteMonitoring.isLeft()) throw new EventHandlerExecutionFailed(JSON.stringify((deleteMonitoring.value as any)?.err));
      } else throw new EventHandlerExecutionFailed(JSON.stringify((monitoringRes.value as any)?.err));
   }
}
bindEventHandler(AfterPatientDeletedEventOnMonitoring, PatientDeletedEvent);
