import { DomainDate, formatError, handleError, Result, SystemCode, ValueObject } from "@shared";

export interface IComplicationData {
   code: SystemCode;
   isPresent: boolean;
   recordedAt: DomainDate;
}

export interface CreateComplicationData {
   code: string;
   isPresent: boolean;
}

export class ComplicationData extends ValueObject<IComplicationData> {
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   protected validate(props: Readonly<IComplicationData>): void {}
   static create(createProps: CreateComplicationData): Result<ComplicationData> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         if (codeRes.isFailure) return Result.fail(formatError(codeRes, ComplicationData.name));
         return Result.ok(
            new ComplicationData({
               code: codeRes.val,
               isPresent: createProps.isPresent,
               recordedAt: new DomainDate(),
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
