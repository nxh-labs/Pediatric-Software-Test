import { ArgumentInvalidException, EmptyStringError, Guard, handleError, isValidCondition, NegativeValueError, Result, ValueObject } from "@shared";

export interface IBiochemicalRange {
   condition: string;
   conditionVariables: string[];
   range: {
      min: [value: number, notStrict: boolean];
      max: [value: number, notStrict: boolean];
   };
   under: string[]; // Same here:But i'm not fix this for the moment 
   over: string[]; // the note when the patient is in over this biochemical Reference
}

export class BiochemicalRange extends ValueObject<IBiochemicalRange> {
   protected validate(props: Readonly<IBiochemicalRange>): void {
      if (!isValidCondition(props.condition))
         throw new ArgumentInvalidException("The condition of BiochemicalRange must be valid. Please change condition and retry.");
      if (props.conditionVariables.some((variable) => Guard.isEmpty(variable).succeeded))
         throw new EmptyStringError("The Condition Variable on BiochemicalRange can't be empty.");
      if (Guard.isNegative(props.range.min[0]).succeeded || Guard.isNegative(props.range.max[0]).succeeded)
         throw new NegativeValueError("The value of biochemicalRange can't be negative value. Please recheck the reference value.");
   }
   static create(props: IBiochemicalRange): Result<BiochemicalRange> {
      try {
         return Result.ok(new BiochemicalRange(props));
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
