import { EmptyStringError, Guard, handleError, Result, ValueObject } from "@shared";

export interface IClinicalSign<T> {
   code: string;
   data: T;
}

export class ClinicalSign<T> extends ValueObject<IClinicalSign<T>> {
   protected validate(props: Readonly<IClinicalSign<T>>): void {
      if (Guard.isEmpty(props.code).succeeded) {
         throw new EmptyStringError("The clinical sign code can't be empty.");
      }
   }
   static create<T>(code: string, data: T): Result<ClinicalSign<T>> {
      try {
         const sign = new ClinicalSign({ code, data });
         return Result.ok(sign);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
