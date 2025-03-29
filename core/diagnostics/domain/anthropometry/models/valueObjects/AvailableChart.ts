import { ArgumentInvalidException, EmptyStringError, Guard, handleError, isValidCondition, Result, SystemCode, ValueObject } from "@shared";

export interface IAvailableChart {
   chartCode: SystemCode;
   condition: string;
   conditionVariables: string[];
}

export interface CreateAvailableChart {
   chartCode: string;
   condition: string;
   conditionVariables: string[];
}

export class AvailableChart extends ValueObject<IAvailableChart> {
   protected validate(props: Readonly<IAvailableChart>): void {
      if (!isValidCondition(props.condition))
         throw new ArgumentInvalidException("The AvailableChart condition is invalid. Please provide an valid condition.");
      if (props.conditionVariables.some((varialbe) => Guard.isEmpty(varialbe).succeeded))
         throw new EmptyStringError("The Available Chart condition variable can't be empty.");
   }
   static create(createProps: CreateAvailableChart): Result<AvailableChart> {
      try {
         const codeRes = SystemCode.create(createProps.chartCode);
         if (codeRes.isFailure) return Result.fail(String(codeRes.err));
         return Result.ok(
            new AvailableChart({ chartCode: codeRes.val, condition: createProps.condition, conditionVariables: createProps.conditionVariables }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
