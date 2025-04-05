import { ConditionResult, Result } from "@shared";
import { ClinicalNutritionalAnalysisResult } from "../../../models";
export type ClinicalVariableObject = { [key: string]: keyof typeof ConditionResult };
export interface IClinicalVariableGeneratorService {
   generate(clinicalAnalysis: ClinicalNutritionalAnalysisResult[]): Promise<Result<ClinicalVariableObject>>;
}
