import { bindEventHandler, DomainEventMessage, EventHandler } from "@shared";
import { VisitRemovedData, VisitRemovedEvent, VisitRepository } from "../../domain";

@DomainEventMessage("After Visit Removed On Monitoring , delete visit on Repository", true)
export class AfterVisitRemovedEventOnMonitoring extends EventHandler<VisitRemovedData, VisitRemovedEvent> {
   constructor(private readonly visitRepo: VisitRepository, priority?: number) {
      super(priority);
   }
   async execute(event: VisitRemovedEvent): Promise<void> {
      await this.onVisitRemovedEvent(event.data);
   }
   private async onVisitRemovedEvent(eventData: VisitRemovedData) {
      await this.visitRepo.delete(eventData.visitId);
   }
}
bindEventHandler(AfterVisitRemovedEventOnMonitoring, VisitRemovedEvent);
