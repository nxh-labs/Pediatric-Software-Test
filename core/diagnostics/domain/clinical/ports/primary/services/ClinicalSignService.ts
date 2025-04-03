import { Result } from "@shared";
import { ClinicalData, NutrientImpact, RecommendedTest } from "../../../models";
import { EvaluationContext, ValidateResult } from "../../../../common";
export interface ClinicalNutritionalAnalysisResult {
   suspectedNutrients: NutrientImpact[]
   recommendedTests: RecommendedTest[]
}
export interface IClinicalSignService {
   validateClinicalData(data: ClinicalData): Promise<Result<ValidateResult>>;
   analyseClinicalData(data: ClinicalData, context: EvaluationContext): Promise<Result<ClinicalNutritionalAnalysisResult[]>>;
}
