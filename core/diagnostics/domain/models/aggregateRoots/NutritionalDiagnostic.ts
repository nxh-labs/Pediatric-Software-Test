import {
   AggregateID,
   AggregateRoot,
   ArgumentNotProvidedException,
   ArgumentOutOfRangeException,
   DomainDate,
   EmptyStringError,
   EntityPropsBaseType,
   Guard,
   InvalidResultError,
} from "@shared";
import { PatientDiagnosticResult, PatientDiagnosticData } from "../entities";
import { DiagnosticModification } from "../valueObjects";

export interface INutritionalDiagnostic extends EntityPropsBaseType {
   patientId: AggregateID;
   patientData: PatientDiagnosticData;
   result?: PatientDiagnosticResult;
   date: DomainDate;
   notes: string[];
   atInit: boolean;
   modificationHistories: DiagnosticModification[];
}

export class NutritionalDiagnostic extends AggregateRoot<INutritionalDiagnostic> {
   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.patientId).succeeded)
         throw new InvalidResultError("The reference to patient can't be empty. Please provide a valid patientId");
      if (!this.props.atInit && Guard.isEmpty(this.props.result).succeeded)
         throw new ArgumentNotProvidedException("The result of diagnostic must be provide when atInit equal to false.");
      if (this.props.notes.some((note) => Guard.isEmpty(note).succeeded)) throw new EmptyStringError("The nutritionist note can't be empty.");
      if (this.props.atInit && !Guard.isEmpty(this.props.result).succeeded)
         throw new ArgumentOutOfRangeException("The result of diagnostic can't be provide when atInit equal to true.");
      this._isValid = true;
   }
}
