import { EmptyStringError, Guard, handleError, Result, SystemCode, ValueObject } from "@shared";

export interface IBiologicalAnalysisInterpretation {
   code: SystemCode;
   interpretation: string;
}
export class BiologicalAnalysisInterpretation extends ValueObject<IBiologicalAnalysisInterpretation> {
   protected validate(props: Readonly<IBiologicalAnalysisInterpretation>): void {
      if (Guard.isEmpty(props.interpretation).succeeded) {
         throw new EmptyStringError("The Biological Analysis Interpretation can't be empty.");
      }
   }
   static create(code: string, interpretation: string): Result<BiologicalAnalysisInterpretation> {
      try {
         const codeRes = SystemCode.create(code);
         if (codeRes.isFailure) return Result.fail(String(codeRes.err));
         return Result.ok(
            new BiologicalAnalysisInterpretation({
               code: codeRes.val,
               interpretation,
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
