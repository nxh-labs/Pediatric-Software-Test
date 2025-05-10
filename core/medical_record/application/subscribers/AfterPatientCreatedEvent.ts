import { bindEventHandler, DomainEventMessage, EventHandler, EventHandlerExecutionFailed, UseCase } from "@shared";
import { PatientCreatedData, PatientCreatedEvent } from "../../../patient";
import { CreatePatientMonitoringRequest, CreatePatientMonitoringResponse } from "../useCases";
@DomainEventMessage("After Patient Created Event , On Monitoring BC Create a new PatientMonitoring", true)
export class AfterPatientCreatedEventOnMonitoring extends EventHandler<PatientCreatedData, PatientCreatedEvent> {
   constructor(
      private readonly createMonitoringUseCase: UseCase<CreatePatientMonitoringRequest, CreatePatientMonitoringResponse>,
      priority?: number,
   ) {
      super(priority);
   }
   async execute(event: PatientCreatedEvent): Promise<void> {
      await this.onPatientCreatedEvent(event.data);
   }
   private async onPatientCreatedEvent(eventData: PatientCreatedData) {
      const result = await this.createMonitoringUseCase.execute({ data: { patientId: eventData.id, visits: [] } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (result.isLeft()) throw new EventHandlerExecutionFailed(JSON.stringify((result.value as any)?.err));
   }
}
bindEventHandler(AfterPatientCreatedEventOnMonitoring, PatientCreatedEvent);
