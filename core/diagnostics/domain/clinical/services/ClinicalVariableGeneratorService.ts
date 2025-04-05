import { handleError, Result } from "@shared";
import { ConditionResult } from "smartcal";
import { ClinicalNutritionalAnalysisResult } from "../models";
import { ClinicalSignReferenceRepository, IClinicalVariableGeneratorService } from "../ports";

export class ClinicalVariableGeneratorService implements IClinicalVariableGeneratorService {
   constructor(private readonly clinicalReferenceRepo: ClinicalSignReferenceRepository) {}
   async generate(clinicalAnalysis: ClinicalNutritionalAnalysisResult[]): Promise<Result<{ [key: string]: keyof typeof ConditionResult }>> {
      try {
         const clinicalReferencesCode = (await this.clinicalReferenceRepo.getAllCode()).map((systemCode) => systemCode.unpack());
         const clinicalAnalysisCodes = clinicalAnalysis.map((clinicalAn) => clinicalAn.unpack().clinicalSign.unpack());
         const clinicalVariableObject: { [key: string]: keyof typeof ConditionResult } = {};
         for (const clinicalRefCode of clinicalReferencesCode) {
            clinicalVariableObject[clinicalRefCode] = clinicalAnalysisCodes.includes(clinicalRefCode) ? "True" : "False";
         }
         return Result.ok(clinicalVariableObject);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
