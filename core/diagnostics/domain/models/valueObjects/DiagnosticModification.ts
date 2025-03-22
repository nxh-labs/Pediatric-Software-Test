import { ArgumentInvalidException, DomainDate, EmptyStringError, Guard, ValueObject } from "@shared";
import { PatientDiagnosticResult } from "../entities";

export interface IDiagnosticModification {
   prevResult: PatientDiagnosticResult;
   nextResult: PatientDiagnosticResult;
   date: DomainDate;
   justification: string;
}

export class DiagnosticModification extends ValueObject<IDiagnosticModification> {
   protected validate(props: Readonly<IDiagnosticModification>): void {
      if (!props.prevResult.equals(props.nextResult) || JSON.stringify(props.prevResult.getProps()) === JSON.stringify(props.nextResult.getProps())) {
         throw new ArgumentInvalidException(
            "The prev Diagnostic Result can't be the same with the next DiagnosticResult when you want to make a modification.",
         );
      }
      if (Guard.isEmpty(props.justification).succeeded)
         throw new EmptyStringError("The justification (raison) why you modify a diagnostic must be provide.");
   }
}
