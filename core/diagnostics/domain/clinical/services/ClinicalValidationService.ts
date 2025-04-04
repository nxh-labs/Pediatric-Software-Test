import { formatError, handleError, Result } from "@shared";
import { ValidateResult } from "../../common";
import { ClinicalData, ClinicalSign, ClinicalSignReference } from "../models";
import { ClinicalSignReferenceRepository, IClinicalValidationService } from "../ports";

export class ClinicalValidationService implements IClinicalValidationService {
    constructor(private readonly clinicalSignRepo: ClinicalSignReferenceRepository) { }
    async validate(clinicalData: ClinicalData): Promise<Result<ValidateResult>> {
        try {
            const signs = this.extractClinicalSigns(clinicalData);
            const valiationResult = await this.validateSignsData(signs);
            if (valiationResult.isFailure) return Result.fail(formatError(valiationResult, ClinicalValidationService.name))
            return Result.ok({ isValid: true })
        } catch (e: unknown) {
            return handleError(e)
        }
    }

    private extractClinicalSigns(data: ClinicalData): ClinicalSign<any>[] {
        return [data.unpack().edema, ...data.unpack().otherSigns];
    }

    private async validateSignsData(signs: ClinicalSign<any>[]): Promise<Result<void>> {
        const references = await this.getClinicalReferences(signs);
        return this.validateRequiredData(signs, references);
    }

    private async getClinicalReferences(signs: ClinicalSign<any>[]): Promise<ClinicalSignReference[]> {
        return Promise.all(signs.map(sign => this.clinicalSignRepo.getByCode(sign.unpack().code)))
    }
    private validateRequiredData(signs: ClinicalSign<any>[], references: ClinicalSignReference[]): Result<void> {
        for (const clinicalRef of references) {
            const clinicalSignData = signs.find(clinicalSignData => clinicalSignData.unpack().code.equals(clinicalRef.getProps().code))!
            const clinicalRefNeedDataCode = clinicalRef.getClinicalSignData().map(clinicalSignData => clinicalSignData.code.unpack())
            const clinicalDataProvided = Object.keys(clinicalSignData.unpack().data)
            if (!clinicalRefNeedDataCode.every(needDataCode => clinicalDataProvided.includes(needDataCode))) {
                return Result.fail("ClinicalSign Validation Failed: Because the provided Clinical Data don't content all the needed value.")
            }

        }
        return Result.ok()
    }

}