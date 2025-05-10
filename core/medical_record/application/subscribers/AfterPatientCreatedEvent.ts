import { bindEventHandler, DomainEventMessage, EventHandler, EventHandlerExecutionFailed, UseCase } from "@shared";
import { PatientCreatedData, PatientCreatedEvent } from "../../../patient";
import { CreateMedicalRecordRequest, CreateMedicalRecordResponse } from "../useCases";

@DomainEventMessage("After Patient Created Event , On Medial Record BC Create a new MedicalRecord", true)
export class AfterPatientCreatedEventOnMonitoring extends EventHandler<PatientCreatedData, PatientCreatedEvent> {
   constructor(private readonly createMedicalRecordUseCase: UseCase<CreateMedicalRecordRequest, CreateMedicalRecordResponse>, priority?: number) {
      super(priority);
   }
   async execute(event: PatientCreatedEvent): Promise<void> {
      await this.onPatientCreatedEvent(event.data);
   }
   private async onPatientCreatedEvent(eventData: PatientCreatedData) {
      const result = await this.createMedicalRecordUseCase.execute({ patientId: eventData.id });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (result.isLeft()) throw new EventHandlerExecutionFailed(JSON.stringify((result.value as any)?.err));
   }
}
bindEventHandler(AfterPatientCreatedEventOnMonitoring, PatientCreatedEvent);
