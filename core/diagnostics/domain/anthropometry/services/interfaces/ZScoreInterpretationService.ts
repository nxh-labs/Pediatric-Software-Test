import { Result } from "@shared";
import { AnthropometricVariableObject } from "../../common";
import { Indicator, IndicatorInterpreter } from "../../models";

export interface IZScoreInterpretationService {
    findIntepretation(data: AnthropometricVariableObject, zScore: number,indicator: Indicator): Promise<Result<IndicatorInterpreter>>
}