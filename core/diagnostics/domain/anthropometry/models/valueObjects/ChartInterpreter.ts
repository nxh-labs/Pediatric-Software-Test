import {
   EmptyStringError,
   formatError,
   Guard,
   handleError,
   Result,
   SystemCode,
   ValueObject,
} from "@shared";
import { Condition, ICondition } from "../../../common";

/**
 * @interface IChartInterpreter : C'est l'interpretation associé a une condition
 * @property `name` - C'est le nom de l'interpretation par ex: Obésité | InsuffisancePondérale | Normale
 * @property `code` - C'est le code associé a ce nom
 * @property `condition` - C'est la condition qui designe cette interpetation par ex: -3< z < -2
 */
export interface IChartInterpreter {
   name: string;
   code: SystemCode;
   condition: Condition;
}
export interface CreateChartInterpreter {
   name: string;
   code: string;
   condition: ICondition;
}
export class ChartInterpreter extends ValueObject<IChartInterpreter> {
   protected validate(props: Readonly<IChartInterpreter>): void {
      if (Guard.isEmpty(props.name).succeeded) throw new EmptyStringError("The name of ChartInterpretation can't be empty.");
   }

   static create(createProps: CreateChartInterpreter): Result<ChartInterpreter> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         const conditionRes = Condition.create(createProps.condition);
         const combinedRes = Result.combine([conditionRes, codeRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, ChartInterpreter.name));
         return Result.ok(
            new ChartInterpreter({
               name: createProps.name,
               code: codeRes.val,
               condition: conditionRes.val,
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
