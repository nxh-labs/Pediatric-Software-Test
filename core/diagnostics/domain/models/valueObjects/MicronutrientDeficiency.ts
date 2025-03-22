import { EmptyStringError, Guard, handleError, Result, SystemCode, ValueObject } from "@shared";

export interface IMicronutrientDeficiency {
   code: SystemCode;
   clinicalSignNames: string[];
}
export type CreateMicronutrientDeficiency = {
   code: string;
   clinicalSignName: string[];
};
export class MicronutrientDeficiency extends ValueObject<IMicronutrientDeficiency> {
   protected validate(props: Readonly<IMicronutrientDeficiency>): void {
      if (props.clinicalSignNames.some((value: string) => Guard.isEmpty(value).succeeded)) {
         throw new EmptyStringError("The clinical Sign name can't be empty on MicroNutrientDeficiency.");
      }
   }
   static create(createProps: CreateMicronutrientDeficiency): Result<MicronutrientDeficiency> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         if (codeRes.isFailure) return Result.fail(String(codeRes.err));
         return Result.ok(
            new MicronutrientDeficiency({
               code: codeRes.val,
               clinicalSignNames: createProps.clinicalSignName,
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
