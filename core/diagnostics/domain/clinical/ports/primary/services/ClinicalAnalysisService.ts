import { Result, SystemCode } from "@shared";
import { EvaluationContext } from "../../../../common";
import { ClinicalData, NutrientImpact, RecommendedTest } from "../../../models";
export interface ClinicalNutritionalAnalysisResult {
    clinicalSign: SystemCode
    suspectedNutrients: NutrientImpact[]
    recommendedTests: RecommendedTest[]
}
export interface IClinicalAnalysisService {
    analyze(data: ClinicalData, context: EvaluationContext): Promise<Result<ClinicalNutritionalAnalysisResult[]>>
}