import { ArgumentInvalidException, EmptyStringError, Guard, handleError, isValidCondition, Result, ValueObject } from "@shared";

export interface IDiagnosticCondition {
   condition: string;
   conditionVariables: string[];
}

export class DiagnosticCondition extends ValueObject<IDiagnosticCondition> {
   protected validate(props: Readonly<IDiagnosticCondition>): void {
      if (!isValidCondition(props.condition)) throw new ArgumentInvalidException("The condition of DiagnosticCondition must be valid.");
      if (props.conditionVariables.some((variable) => Guard.isEmpty(variable).succeeded))
         throw new EmptyStringError("The condition variable can't be empty.");
   }
   static create(props: IDiagnosticCondition): Result<DiagnosticCondition> {
      try {
         return Result.ok(new DiagnosticCondition(props));
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
