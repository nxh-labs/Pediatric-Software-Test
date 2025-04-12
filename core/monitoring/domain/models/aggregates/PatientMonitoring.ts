import { AggregateID, AggregateRoot, BaseEntityProps, EntityPropsBaseType, handleError, Result } from "@shared";
import { IVisit, Visit } from "../entities";
import { VisitAddedEvent, VisitRemovedEvent } from "../../events";

export interface IPatientMonitoring extends EntityPropsBaseType {
   patientId: AggregateID;
   visits: Visit[];
}

export class PatientMonitoring extends AggregateRoot<IPatientMonitoring> {
   getVisits(): (IVisit & BaseEntityProps)[] {
      return this.props.visits.map((entity) => entity.getProps());
   }
   getPatientId(): AggregateID {
      return this.props.patientId;
   }
   addVisit(visit: Visit) {
      const index = this.props.visits.findIndex((vit) => vit.equals(visit));
      if (index != -1) this.props.visits[index] = visit;
      else this.props.visits.push(visit);
      this.validate();
      this.addDomainEvent(new VisitAddedEvent({ patientId: this.getPatientId(), visitId: visit.id }));
   }
   removeVisit(visitId: AggregateID) {
      const index = this.props.visits.findIndex((vit) => vit.id === visitId);
      if (index != -1) {
         this.props.visits.splice(index, 1);
         this.validate();
         this.addDomainEvent(new VisitRemovedEvent({ patientId: this.getPatientId(), visitId }));
      }
   }
   public validate(): void {
      this._isValid = false;
      // Validation Code here
      this._isValid = true;
   }
   static create(props: IPatientMonitoring, id: AggregateID): Result<PatientMonitoring> {
      try {
         return Result.ok(new PatientMonitoring({ id, props }));
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
