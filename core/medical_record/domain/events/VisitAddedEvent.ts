import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";

export interface VisitAddedData {
   patientId: AggregateID;
   visitId: AggregateID;
}
@DomainEventMessage("New Patient Visit Added to Monitoring System", true)
export class VisitAddedEvent extends DomainEvent<VisitAddedData> {}
