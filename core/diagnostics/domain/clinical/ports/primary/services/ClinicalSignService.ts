import { Result } from "@shared";
import { ClinicalData, ClinicalSignReference, MicronutrientDeficiency } from "../../../models";

export interface IClinicalSignService {
   identifyPossibleSign(data: ClinicalData): Promise<Result<ClinicalSignReference[]>>;
   getSuspectedNutrients(data: ClinicalData): Promise<Result<MicronutrientDeficiency[]>>;
}
