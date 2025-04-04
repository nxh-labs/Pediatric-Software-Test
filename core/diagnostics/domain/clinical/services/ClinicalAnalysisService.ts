import { ArgumentInvalidException, ConditionResult, evaluateCondition, handleError, Result } from "@shared";
import { EvaluationContext } from "../../common";
import { ClinicalData, ClinicalSign, ClinicalSignReference } from "../models";
import {  ClinicalNutritionalAnalysisResult, ClinicalSignReferenceRepository, IClinicalAnalysisService, NutritionalRiskFactorRepository } from "../ports";

export class ClinicalAnalysisService implements IClinicalAnalysisService {
    constructor(private readonly clinicalSignRepo: ClinicalSignReferenceRepository,
        private readonly nutritionalRiskFactorRepo: NutritionalRiskFactorRepository,
    ) { }
    async analyze(data: ClinicalData, context: EvaluationContext): Promise<Result<ClinicalNutritionalAnalysisResult[]>> {
        try {
            const presentSigns = await this.identifyPresentSigns(data, context);
            const analysisResults = await this.analyzeNutritionalRisks(presentSigns, context);
            return Result.ok(analysisResults);
        } catch (e: unknown) {
            return handleError(e);
        }
    }
    private extractClinicalSigns(data: ClinicalData): ClinicalSign<any>[] {
        return [data.unpack().edema, ...data.unpack().otherSigns];
    }
    // TODO: OPTIMISER 
    private async identifyPresentSigns(data: ClinicalData, context: EvaluationContext): Promise<ClinicalSign<any>[]> {
        const signs = this.extractClinicalSigns(data);
        const presentClinicalSigns = []
        for (const clinicalSign of signs) {
            const clinicalSignAssociatedData = clinicalSign.unpack().data
            const clinicalSignRef: ClinicalSignReference = await this.clinicalSignRepo.getByCode(clinicalSign.unpack().code)
            const clinicalSignRefNeedDataCode = clinicalSignRef.getClinicalSignData().map(signData => signData.code.unpack())
            if (!clinicalSignRefNeedDataCode.every(clinicalRefNeededCode => (clinicalSignAssociatedData as Record<string, string>)[clinicalRefNeededCode])) {
                throw new ArgumentInvalidException("Clinical ") // TODO: 
            }
            const ruleEvaluationVariable = { ...clinicalSignAssociatedData, ...context }
            if (!clinicalSignRef.getRule().variables.every(variable => Object.keys(ruleEvaluationVariable).includes(variable))) {
                throw new ArgumentInvalidException("Clinical Analyse failed: Because the provided Clinical Data don't content all the needed value.")
            }
            const ruleEvaluationResult = evaluateCondition(clinicalSignRef.getRule().value, ruleEvaluationVariable)
            if (ruleEvaluationResult === ConditionResult.True) presentClinicalSigns.push(clinicalSign);
        }
        return presentClinicalSigns
    }
    // TODO: OPTIMISATION
    private async analyzeNutritionalRisks(presentSigns: ClinicalSign<any>[], context: EvaluationContext): Promise<ClinicalNutritionalAnalysisResult[]> {
        const clinicalSignAnalyseResult: ClinicalNutritionalAnalysisResult[] = []
        for (const presentClinicalSign of presentSigns) {
            const nutritionalRiskFactors = await this.nutritionalRiskFactorRepo.getByClinicalRefCode(presentClinicalSign.unpack().code)
            const adaptedNutritionalRiskFactor = nutritionalRiskFactors.filter(nutritionalRiskFactor => {
                const { value: condition } = nutritionalRiskFactor.getModulatingCondition()
                const modulatingConditionResult = evaluateCondition(condition, context)
                if (modulatingConditionResult === ConditionResult.True) return true
                return false
            })
            clinicalSignAnalyseResult.push({
                clinicalSign: presentClinicalSign.unpack().code,
                recommendedTests: [...adaptedNutritionalRiskFactor.flatMap(riskFactor => riskFactor.getProps().recommendedTests)],
                suspectedNutrients: [...adaptedNutritionalRiskFactor.flatMap(riskFactor => riskFactor.getProps().associatedNutrients)]
            })

        }
        return clinicalSignAnalyseResult
    }
}