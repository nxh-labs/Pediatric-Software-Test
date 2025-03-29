import { ArgumentInvalidException, EmptyStringError, Guard, handleError, isValidCondition, Result, SystemCode, ValueObject } from "@shared";

/**
 * @interface IChartInterpreter : C'est l'interpretation associé a une condition
 * @property `name` - C'est le nom de l'interpretation par ex: Obésité | InsuffisancePondérale | Normale
 * @property `code` - C'est le code associé a ce nom
 * @property `condition` - C'est la condition qui designe cette interpetation par ex: -3< z < -2
 * @property `conditionVAriable` - C'est l'ensemble des varibles contenu dans la condition par ex: [z]
 */
export interface IChartInterpreter {
   name: string;
   code: SystemCode;
   condition: string;
   conditionVariables: string[];
}
export interface CreateChartInterpreter {
   name: string;
   code: string;
   condition: string;
   conditionVariables: string[];
}
export class ChartInterpreter extends ValueObject<IChartInterpreter> {
   protected validate(props: Readonly<IChartInterpreter>): void {
      if (!isValidCondition(props.condition)) throw new ArgumentInvalidException("The provide condition is not valid. Please check the condition.");
      if (props.conditionVariables.some((variable) => !Guard.isEmpty(variable).succeeded))
         throw new EmptyStringError("The condition variable can't be empty. Please check a provided variable.");
      if (Guard.isEmpty(props.name).succeeded) throw new EmptyStringError("The name of ChartInterpretation can't be empty.");
   }

   static create(createProps: CreateChartInterpreter): Result<ChartInterpreter> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         if (codeRes.isFailure) return Result.fail(String(codeRes.err));
         return Result.ok(
            new ChartInterpreter({
               name: createProps.name,
               code: codeRes.val,
               condition: createProps.condition,
               conditionVariables: createProps.conditionVariables,
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
