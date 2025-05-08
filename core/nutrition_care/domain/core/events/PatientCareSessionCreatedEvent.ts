import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";

export interface PatientCareSessionCreatedData {
   id: AggregateID;
   patientId: AggregateID;
}

@DomainEventMessage("New Patient Care Session is Created.", true)
export class PatientCareSessionCreatedEvent extends DomainEvent<PatientCareSessionCreatedData> {}
