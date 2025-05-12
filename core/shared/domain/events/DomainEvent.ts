import { DomainEvent, EventData, EventHandler, IDomainEvent } from "domain-eventrix";
export { DomainEvent, DomainEventMessage, bindEventHandler, EventHandler } from "domain-eventrix";
export interface IEventBus {
   publish<Data extends EventData, T extends DomainEvent<Data>>(event: T): void;
   publishAndDispatchImmediate<Data extends EventData, T extends DomainEvent<Data>>(event: T): Promise<void>;
  suscriber<DataType extends EventData, T extends IDomainEvent<DataType>>(handler: EventHandler<DataType, T>): void;
}
