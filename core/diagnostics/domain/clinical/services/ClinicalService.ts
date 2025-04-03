import { handleError, Result } from "@shared";
import { ClinicalNutritionalAnalysisResult, ClinicalSignReferenceRepository, IClinicalSignService } from "../ports";
import { ClinicalData, ClinicalSignReference } from "../models";
import { EvaluationContext, ValidateResult } from "../../common";

export class ClinicalService implements IClinicalSignService {
    constructor(private readonly clinicalSignRepo: ClinicalSignReferenceRepository,) { }
    async validateClinicalData(data: ClinicalData): Promise<Result<ValidateResult>> {
        try {
            const clinicalData = [data.unpack().edema, ...data.unpack().otherSigns]
            const availableClincialSignCode = clinicalData.map(clinicalSign => clinicalSign.unpack().code)
            const clinicalReferences = await Promise.all(availableClincialSignCode.map((code): Promise<ClinicalSignReference> => this.clinicalSignRepo.getByCode(code)))
            for (const clinicalRef of clinicalReferences) {
                const clinicalSignData = clinicalData.find(clinicalSignData => clinicalSignData.unpack().code.equals(clinicalRef.getProps().code))!
                const clinicalRefNeedDataCode = clinicalRef.getClinicalSignData().map(clinicalSignData => clinicalSignData.code.unpack())
                const clinicalDataProvided = Object.keys(clinicalSignData.unpack().data)
                if (!clinicalRefNeedDataCode.every(needDataCode => clinicalDataProvided.includes(needDataCode))) {
                    return Result.fail("ClinicalSign Validation Failed: Because the provided Clinical Data don't content all the needed value.")
                }
            }
            return Result.ok({ isValid: true })
        }

        catch (e: unknown) {
            return handleError(e)
        }

    }
    analyseClinicalData(data: ClinicalData, context: EvaluationContext): Promise<Result<ClinicalNutritionalAnalysisResult[]>> {
    }

}