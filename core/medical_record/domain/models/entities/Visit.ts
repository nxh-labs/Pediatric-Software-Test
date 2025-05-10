import { AggregateID, DomainDate, Entity, EntityPropsBaseType, formatError, handleError, Result } from "@shared";
import { CreateVisitMeasurementProps, IVisitMeasurement, ObservationNote, VisitMeasurement, VisitPurpose } from "../valueObjects";

export interface IVisit extends EntityPropsBaseType {
   date: DomainDate;
   visitPurpose: VisitPurpose;
   notes: ObservationNote[];
   measurement: VisitMeasurement;
   observerId: AggregateID;
}

export interface CreateVisitProps {
   visitPurpose: string;
   notes: string[];
   measurement: CreateVisitMeasurementProps;
   observerId: AggregateID;
}
export class Visit extends Entity<IVisit> {
   getDate(): string {
      return this.props.date.toString();
   }
   getPurpose(): string {
      return this.props.visitPurpose.unpack();
   }
   getNotes(): string[] {
      return this.props.notes.map((note) => note.unpack());
   }
   getMeasurement(): IVisitMeasurement {
      return this.props.measurement.unpack();
   }
   getObserverId(): AggregateID {
      return this.props.observerId;
   }
   changePurpose(visitPurpose: VisitPurpose) {
      this.props.visitPurpose = visitPurpose;
      this.validate();
   }
   changeNotes(notes: ObservationNote[]) {
      this.props.notes = notes;
      this.validate();
   }
   changeMeasurement(measurement: VisitMeasurement) {
      this.props.measurement = measurement;
      this.validate();
   }
   changeObserverId(observerId: AggregateID) {
      this.props.observerId = observerId;
      this.validate();
   }
   public validate(): void {
      this._isValid = false;
      // Validation Code here
      this._isValid = true;
   }
   static create(createProps: CreateVisitProps, id: AggregateID): Result<Visit> {
      try {
         const visitPurposeRes = VisitPurpose.create(createProps.visitPurpose);
         const notesRes = createProps.notes.map(ObservationNote.create);
         const measurementRes = VisitMeasurement.create(createProps.measurement);
         const date = new DomainDate();
         const combinedRes = Result.combine([visitPurposeRes, measurementRes, ...notesRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, Visit.name));
         return Result.ok(
            new Visit({
               id,
               props: {
                  date,
                  visitPurpose: visitPurposeRes.val,
                  notes: notesRes.map((res) => res.val),
                  measurement: measurementRes.val,
                  observerId: createProps.observerId,
               },
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
