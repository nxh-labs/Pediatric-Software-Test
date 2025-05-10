import { DomainPrimitive, EmptyStringError, Guard, handleError, Result, ValueObject } from "@shared";

export class ObservationNote extends ValueObject<string> {
   protected validate(props: Readonly<DomainPrimitive<string>>): void {
      if (Guard.isEmpty(props._value).succeeded) throw new EmptyStringError("The observation note can't be empty.");
   }
   static create(note: string): Result<ObservationNote> {
      try {
         return Result.ok(new ObservationNote({ _value: note }));
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
