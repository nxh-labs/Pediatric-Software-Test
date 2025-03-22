import { Entity, AggregateID } from "./Entity";
import { DomainEvent } from "./../events";

export abstract class AggregateRoot<
  EntityProps extends {}
> extends Entity<EntityProps> {
  private _domainEvents: DomainEvent<any>[] = [];
  getID(): AggregateID {
    return this.id;
  }
  getDomainEvents(): DomainEvent<any>[] {
    return this._domainEvents;
  }
  clearDomainEvent(): void {
    this._domainEvents = [];
  }
  protected addDomainEvent<T extends {}>(domainEvent: DomainEvent<T>): void {
    // Add the domain event to this aggregate's list of domain events
    this._domainEvents.push(domainEvent);
    // Log the domain event
    this.logDomainEventAdded(domainEvent);
  }

  private logDomainEventAdded(domainEvent: DomainEvent<any>): void {
    const thisClass = Reflect.getPrototypeOf(this);
    console.info(
      `[Domain Event Created]:`,
      thisClass?.constructor.name,
      "==>",
      domainEvent.getName()
    );
  }
}
