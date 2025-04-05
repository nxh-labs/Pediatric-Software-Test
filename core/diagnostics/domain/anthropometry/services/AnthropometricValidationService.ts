import { ConditionResult, evaluateCondition, handleError, Result } from "@shared";
import { EvaluationContext, ValidateResult } from "../../common";
import { AnthropometricData } from "../models";
import { AnthropometricMeasureRepository, IAnthropometricValidationService, UnitAcl } from "../ports";
import { ANTHROPOMETRIC_MEASURE_ERROR, handleAnthropometricError } from "../errors";

export class AnthropometricValidationService implements IAnthropometricValidationService {
   constructor(private readonly anthropMeasureRepo: AnthropometricMeasureRepository, private readonly unitAcl: UnitAcl) {}

   async validate(data: AnthropometricData, context: EvaluationContext): Promise<Result<ValidateResult>> {
      try {
         const anthropometricEntries = data.unpack();
         for (const anthropEntry of anthropometricEntries) {
            const anthropMeasure = await this.anthropMeasureRepo.getByCode(anthropEntry.code);
            // Validate Unit first
            const anthropMeasureAvailableUnits = anthropMeasure.getUnits().availableUnits;
            if (!anthropMeasureAvailableUnits.includes(anthropEntry.unit.unpack())) {
               return handleAnthropometricError(
                  ANTHROPOMETRIC_MEASURE_ERROR.VALIDATION.INVALID_UNIT.path,
                  `AnthroUnit: ${anthropEntry.unit.unpack()} , AvailableUnit : ${anthropMeasureAvailableUnits.join(";")}.`,
               );
            }
            // Check Validation Rules
            // Convert the value of anthropEntry a the right measure
            const anthropEntryValue =
               anthropEntry.unit.unpack() === anthropMeasure.getUnits().defaultUnit
                  ? anthropEntry.value
                  : await this.unitAcl.convertTo(anthropEntry.unit, anthropMeasure.getProps().unit, anthropEntry.value);
            const validationRules = anthropMeasure.getValidationRules();
            // Build the condition and rule variables Object
            const validationDataObject = {
               [anthropMeasure.getCode()]: anthropEntryValue,
               ...context,
               sex: context.sex.toString(),
            };
            const filterApplicableRules = validationRules.filter((validationRule) => {
               const { condition } = validationRule;
               const conditionResult = evaluateCondition(condition, validationDataObject);
               if (conditionResult === ConditionResult.True) return true;
               return false;
            });
            // Check Rules
            for (const { rule } of filterApplicableRules) {
               const ruleResult = evaluateCondition(rule, validationDataObject);
               if (ruleResult === ConditionResult.False)
                  return handleAnthropometricError(
                     ANTHROPOMETRIC_MEASURE_ERROR.VALIDATION.INVALID_VALUE.path,
                     `filedName: ${anthropEntry.code.unpack()}, Rules:  ${rule}, variables: ${Object.keys(validationDataObject).join(";")}.`,
                  );
            }
         }
         return Result.ok({ isValid: true });
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
