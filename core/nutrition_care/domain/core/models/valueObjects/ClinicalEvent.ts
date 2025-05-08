import { formatError, handleError, Result, SystemCode, ValueObject } from "@shared";

export interface IClinicalEvent {
   code: SystemCode;
}

export interface CreateClinicalEvent {
   code: string;
}
export class ClinicalEvent extends ValueObject<IClinicalEvent> {
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   protected validate(props: Readonly<IClinicalEvent>): void {}

   static create(props: CreateClinicalEvent): Result<ClinicalEvent> {
      try {
         const codeRes = SystemCode.create(props.code);
         if (codeRes.isFailure) return Result.fail(formatError(codeRes, ClinicalEvent.name));
         return Result.ok(new ClinicalEvent({ code: codeRes.val }));
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
