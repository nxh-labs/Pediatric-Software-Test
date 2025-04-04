import { ConditionResult, evaluateCondition, handleError, Result } from "@shared";
import { EvaluationContext } from "../../common";
import { BiologicalTestResult, BiologicalAnalysisInterpretation, BiochemicalReference } from "../models";
import { BiochemicalReferenceRepository, BiologicalUnitACL, IBiologicalInterpretationService } from "../ports";
import { BIOLOGICAL_SERVICE_ERRORS, handleBiologicalError } from "../errors";

export class BiologicalInterpretationService implements IBiologicalInterpretationService {
   constructor(private readonly biochemicalRefRepo: BiochemicalReferenceRepository, private readonly biologicalUnitConvertor: BiologicalUnitACL) {}
   async interpret(data: BiologicalTestResult[], context: EvaluationContext): Promise<Result<BiologicalAnalysisInterpretation[]>> {
      const referencesResult = await this.getBiochemicalReference(data);
      if (referencesResult.isFailure) return handleBiologicalError(BIOLOGICAL_SERVICE_ERRORS.VALIDATION.REFERENCE_NOT_FOUND.path);
   }
   private async getBiochemicalReference(data: BiologicalTestResult[]): Promise<Result<BiochemicalReference[]>> {
      try {
         const references = await Promise.all(data.map((biologicalTest) => this.biochemicalRefRepo.getByCode(biologicalTest.unpack().code)));
         return Result.ok(references);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
   private interpetBiologicalTestResult(biologicalTestResult: BiologicalTestResult, context: EvaluationContext, references: BiochemicalReference) {
      const biochemicalRanges = references.getProps().ranges;
      const usableRanges = biochemicalRanges.filter((range) => {
         const { value: modulatingCondition } = range.unpack().condition.unpack();
         const conditionResult = evaluateCondition(modulatingCondition, context);
         return conditionResult === ConditionResult.True;
      });
      
   }

   private async convertBiologicalResultValueToRefUnit(
      biologicalTestResult: BiologicalTestResult,
      reference: BiochemicalReference,
   ): Promise<BiologicalTestResult> {
      const biologicalTestResultUnit = biologicalTestResult.unpack().unit;
      const biochemicalRefUnit = reference.getProps().unit;
      if (biologicalTestResultUnit.equals(biochemicalRefUnit)) return biologicalTestResult;
      else {
         const convertedValue = await this.biologicalUnitConvertor.convertTo(
            biologicalTestResultUnit,
            biochemicalRefUnit,
            biologicalTestResult.unpack().value,
         );
         return new BiologicalTestResult({ value: convertedValue, unit: biochemicalRefUnit, code: biologicalTestResult.unpack().code });
      }
   }
}
