import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";

export interface VisitRemovedData {
   patientId: AggregateID;
   visitId: AggregateID;
}
@DomainEventMessage("Visit Removed From Patient Monitoring System", true)
export class VisitRemovedEvent extends DomainEvent<VisitRemovedData> {}
