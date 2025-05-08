import { DomainEvent, EventData } from "domain-eventrix";
export { DomainEvent, DomainEventMessage, bindEventHandler, EventHandler } from "domain-eventrix";
export interface IEventBut {
   publish<Data extends EventData, T extends DomainEvent<Data>>(event: T): void;
   publishAndDispatchImmediate<Data extends EventData, T extends DomainEvent<Data>>(event: T): Promise<void>;
}
