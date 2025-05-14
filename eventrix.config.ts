// eventrix.config.ts
import DomainEventrix from "domain-eventrix";

DomainEventrix.create({
   // eventBusKey: "PediatricAppEventBus",
});
DomainEventrix.addEventProcessingStateManager()
// console.log(DomainEventrix.get("PediatricAppEventBus"))