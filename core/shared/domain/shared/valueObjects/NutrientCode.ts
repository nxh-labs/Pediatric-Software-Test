import { Guard, Result } from "./../../../core";
import { EmptyStringError, ExceptionBase, handleError } from "./../../../exceptions";
import { ValueObject, DomainPrimitive } from "./../../common";

export class NutrientCode extends ValueObject<string> {
   toString(): string {
      return this.props._value;
   }
   protected validate(props: DomainPrimitive<string>): void {
      if (Guard.isEmpty(props._value)) throw new EmptyStringError("The code of nutrient can't be empty.");
   }
   static create(code: string): Result<NutrientCode> {
      try {
         const nutrientCode = new NutrientCode({ _value: code });
         return Result.ok<NutrientCode>(nutrientCode);
      } catch (error) {
         return handleError(error);
      }
   }
}
