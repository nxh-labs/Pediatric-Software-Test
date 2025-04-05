import { ICondition } from "../../../domain";
import { NutrientImpactDto } from "./NutrientImpactDto";
import { RecommendedTestDto } from "./RecommendedTestDto";

export interface NutritionalRiskFactorDto {
   clinicalSignCode: string;
   associatedNutrients: NutrientImpactDto[];
   modulatingCondition: ICondition;
   recommendedTests: RecommendedTestDto[];
}
