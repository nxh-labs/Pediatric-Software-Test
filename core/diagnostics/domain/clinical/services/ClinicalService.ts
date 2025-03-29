import { Result } from "@shared";
import { IClinicalSignService } from "../ports";
import { ClinicalData, ClinicalSignReference, MicronutrientDeficiency } from "../models";

export class ClinicalService implements IClinicalSignService {
    identifyPossibleSign(data: ClinicalData): Promise<Result<ClinicalSignReference[]>> {
        throw new Error("Method not implemented.");
    }
    getSuspectedNutrients(data: ClinicalData): Promise<Result<MicronutrientDeficiency[]>> {
        throw new Error("Method not implemented.");
    }
    
}