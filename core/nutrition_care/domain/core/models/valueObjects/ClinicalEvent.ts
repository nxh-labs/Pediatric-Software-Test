import { formatError, handleError, Result, SystemCode, ValueObject } from "@shared";

export interface IClinicalEvent {
   code: SystemCode;
   isPresent: boolean;
}

export interface CreateClinicalEvent {
   code: string;
   isPresent: boolean;
}
export class ClinicalEvent extends ValueObject<IClinicalEvent> {
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   protected validate(props: Readonly<IClinicalEvent>): void {}

   static create(props: CreateClinicalEvent): Result<ClinicalEvent> {
      try {
         const codeRes = SystemCode.create(props.code);
         if (codeRes.isFailure) return Result.fail(formatError(codeRes, ClinicalEvent.name));
         return Result.ok(new ClinicalEvent({ code: codeRes.val, isPresent: props.isPresent }));
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
