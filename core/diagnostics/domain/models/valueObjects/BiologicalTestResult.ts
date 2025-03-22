import { EmptyStringError, Guard, handleError, NegativeValueError, Result, UnitCode, ValueObject } from "@shared";

export interface IBiologicalTestResult {
   code: string;
   value: number;
   unit: UnitCode;
}
export type CreateBiologicalTestResult = {
   code: string;
   value: number;
   unit: string;
};
export class BiologicalTestResult extends ValueObject<IBiologicalTestResult> {
   protected validate(props: Readonly<IBiologicalTestResult>): void {
      if (Guard.isEmpty(props.code).succeeded) {
         throw new EmptyStringError("The BiologicalTestResult code can't be empty. Please provide a valid code.");
      }
      if (Guard.isNegative(props.value).succeeded) {
         throw new NegativeValueError("The BiologicalTestResult value can't be an negative value. Please provide a positive value.");
      }
      if (Guard.isEmpty(props.unit.unpack()).succeeded) {
         throw new EmptyStringError("The BiologicalTestResult unt can't be empty. Please provide a valid unit.");
      }
   }
   static create(createProps: CreateBiologicalTestResult): Result<BiologicalTestResult> {
      try {
         const unitCode = UnitCode.create(createProps.code);
         if (unitCode.isFailure) return Result.fail<BiologicalTestResult>(String(unitCode.err));
         const biologicalTestResult = new BiologicalTestResult({
            code: createProps.code,
            value: createProps.value,
            unit: unitCode.val,
         });
         return Result.ok(biologicalTestResult);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
