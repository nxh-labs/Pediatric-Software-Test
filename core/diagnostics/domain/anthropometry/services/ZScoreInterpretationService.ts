import { ConditionResult, evaluateCondition, handleError, Result } from "@shared";
import { AnthropometricVariableObject } from "../common";
import { Indicator, IndicatorInterpreter } from "../models";
import { IZScoreInterpretationService } from "./interfaces/ZScoreInterpretationService";

export class ZScoreInterpretationService implements IZScoreInterpretationService {
    constructor() { }
    async findIntepretation(data: AnthropometricVariableObject, zScore: number, indicator: Indicator): Promise<Result<IndicatorInterpreter>> {
        try {
            const interpretations = indicator.getProps().interpretations;
            const interpretation = interpretations.find(interp => {
                const { condition } = interp.unpack()
                const conditionResult = evaluateCondition(
                    condition.unpack().value,
                    { ...data, z: zScore }
                );
                return conditionResult === ConditionResult.True;
            });

            if (!interpretation) {
                return Result.fail(GROWTH_INDICATOR_ERRORS.INTERPRETATION_NOT_FOUND);
            }

            return Result.ok(interpretation);
        } catch (e: unknown) {
            return handleError(e)
        }
    }

}