import { DomainPrimitive, EmptyStringError, Guard, handleError, Result, ValueObject } from "@shared";

export class VisitPurpose extends ValueObject<string> {
   protected validate(props: Readonly<DomainPrimitive<string>>): void {
      if (Guard.isEmpty(props._value).succeeded) throw new EmptyStringError("The visit purpose can't be empty.");
   }
   static create(visitPurpose: string): Result<VisitPurpose> {
      try {
         return Result.ok(new VisitPurpose({ _value: visitPurpose }));
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
