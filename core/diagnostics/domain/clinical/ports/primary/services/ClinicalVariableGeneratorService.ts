import { ConditionResult, Result } from "@shared";
import { ClinicalNutritionalAnalysisResult } from "../../../models";

export interface IClinicalVariableGeneratorService {
   generate(clinicalAnalysis: ClinicalNutritionalAnalysisResult[]): Promise<Result<{ [key: string]: keyof typeof ConditionResult }>>;
}
