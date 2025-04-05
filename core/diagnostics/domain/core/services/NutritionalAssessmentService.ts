import { ConditionResult, evaluateCondition, Factory, formatError, handleError, Result, Sex } from "@shared";
import { PatientDiagnosticData, NutritionalAssessmentResult, GlobalDiagnostic, DiagnosticRule } from "../models";
import { DiagnosticRuleRepository, INutritionalAssessmentService } from "../ports";
import { AnthropometricVariableObject, GrowthIndicatorValue, IAnthropometricService, IGrowthIndicatorService } from "../../anthropometry";
import { ClinicalNutritionalAnalysisResult, IClinicalAnalysisService, IClinicalVariableGeneratorService } from "../../clinical";
import { BiologicalAnalysisInterpretation, IBiologicalInterpretationService } from "../../biological";
import { EvaluationContext } from "../../common";
import { CORE_SERVICE_ERRORS, handleDiagnosticCoreError } from "../errors";
import { CreateNutritionalAssessmentResultProps } from "../factories";

/**
 * Type representing variables used in global diagnostic evaluation
 */
export type GlobalDiagnosticVariable = AnthropometricVariableObject & { [key: string]: number | Sex | keyof typeof ConditionResult };

/**
 * Service responsible for performing nutritional assessments by evaluating anthropometric,
 * clinical, and biological data to generate comprehensive nutritional diagnostics
 */
export class NutritionalAssessmentService implements INutritionalAssessmentService {
   /**
    * Creates a new instance of NutritionalAssessmentService
    * @param anthropService Service for anthropometric calculations
    * @param growthIndicatorService Service for growth indicator evaluations
    * @param clinicalService Service for clinical analysis
    * @param clinicalVariableGenerator Service for generating clinical variables
    * @param biologicalService Service for biological interpretations
    * @param diagnosticRuleRepo Repository for diagnostic rules
    * @param nutritionalAssessmentResultFactory Factory for creating nutritional assessment results
    */
   constructor(
      private readonly anthropService: IAnthropometricService,
      private readonly growthIndicatorService: IGrowthIndicatorService,
      private readonly clinicalService: IClinicalAnalysisService,
      private readonly clinicalVariableGenerator: IClinicalVariableGeneratorService,
      private readonly biologicalService: IBiologicalInterpretationService,
      private readonly diagnosticRuleRepo: DiagnosticRuleRepository,
      private readonly nutritionalAssessmentResultFactory: Factory<CreateNutritionalAssessmentResultProps, NutritionalAssessmentResult>,
   ) {}

   /**
    * Evaluates the nutritional status of a patient based on various health indicators
    * @param patientData Patient diagnostic data to evaluate
    * @returns Promise containing the result of the nutritional assessment
    */
   async evaluateNutritionalStatus(patientData: PatientDiagnosticData): Promise<Result<NutritionalAssessmentResult>> {
      try {
         const anthropEvaluation = await this.getAnthropEvaluation(patientData);
         const clinicalEvaluation = await this.getClinicalEvaluation(patientData);
         const biologicalEvaluation = await this.getBiologicalEvaluation(patientData);
         const evaluationResult = Result.combine([anthropEvaluation, clinicalEvaluation, biologicalEvaluation]);
         if (evaluationResult.isFailure) return Result.fail(formatError(evaluationResult, NutritionalAssessmentService.name));
         const globalDiagnostics = await this.globalEvaluation(patientData, anthropEvaluation.val, clinicalEvaluation.val);
         if (globalDiagnostics.isFailure) return Result.fail(formatError(globalDiagnostics, NutritionalAssessmentService.name));
         const nutritionAssessmentResult = await this.nutritionalAssessmentResultFactory.create({
            globalDiagnostics: globalDiagnostics.val,
            growthIndicatorValues: anthropEvaluation.val,
            clinicalAnalysis: clinicalEvaluation.val,
            biologicalInterpretation: biologicalEvaluation.val,
         });
         return nutritionAssessmentResult;
      } catch (e: unknown) {
         return handleError(e);
      }
   }

   /**
    * Generates an evaluation context from patient data
    * @param patientData Patient diagnostic data
    * @returns Evaluation context containing age and sex information
    */
   private generateContext(patientData: PatientDiagnosticData): EvaluationContext {
      return {
         age_in_day: patientData.age_in_day,
         age_in_month: patientData.age_in_month,
         age_in_year: patientData.age_in_year,
         sex: patientData.getGender().unpack(),
      };
   }

   /**
    * Performs anthropometric evaluation based on patient data
    * @param patientData Patient diagnostic data
    * @returns Promise containing growth indicator values
    */
   private async getAnthropEvaluation(patientData: PatientDiagnosticData): Promise<Result<GrowthIndicatorValue[]>> {
      try {
         const anthropometricDataResult = await this.generateAnthropVariableObject(patientData);
         if (anthropometricDataResult.isFailure) return Result.fail(formatError(anthropometricDataResult, NutritionalAssessmentResult.name));
         return this.growthIndicatorService.calculateAllIndicators(anthropometricDataResult.val);
      } catch (e: unknown) {
         return handleError(e);
      }
   }

   /**
    * Performs clinical evaluation based on patient data
    * @param patientData Patient diagnostic data
    * @returns Promise containing clinical nutritional analysis results
    */
   private async getClinicalEvaluation(patientData: PatientDiagnosticData): Promise<Result<ClinicalNutritionalAnalysisResult[]>> {
      try {
         const context = this.generateContext(patientData);
         return this.clinicalService.analyze(patientData.getClinicalSigns(), context);
      } catch (e: unknown) {
         return handleError(e);
      }
   }

   /**
    * Performs biological evaluation based on patient data
    * @param patientData Patient diagnostic data
    * @returns Promise containing biological analysis interpretations
    */
   private async getBiologicalEvaluation(patientData: PatientDiagnosticData): Promise<Result<BiologicalAnalysisInterpretation[]>> {
      try {
         const context = this.generateContext(patientData);
         return this.biologicalService.interpret(patientData.getBiologicalTestResults(), context);
      } catch (e: unknown) {
         return handleError(e);
      }
   }

   /**
    * Performs global evaluation combining anthropometric and clinical data
    * @param patientData Patient diagnostic data
    * @param growthIndicatorValues Growth indicator values from anthropometric evaluation
    * @param clinicalAnalysis Results from clinical analysis
    * @returns Promise containing global diagnostics
    */
   private async globalEvaluation(
      patientData: PatientDiagnosticData,
      growthIndicatorValues: GrowthIndicatorValue[],
      clinicalAnalysis: ClinicalNutritionalAnalysisResult[],
   ): Promise<Result<GlobalDiagnostic[]>> {
      try {
         const anthropometricVariableRes = await this.generateAnthropVariableObject(patientData, growthIndicatorValues);
         const clinicalVariable = await this.generateClinicalVariableObject(clinicalAnalysis);
         const combinedResult = Result.combine([anthropometricVariableRes, clinicalVariable]);
         if (combinedResult.isFailure) {
            return handleDiagnosticCoreError(
               CORE_SERVICE_ERRORS.NUTRITIONAL_ASSESSMENT.NEEDED_VARIABLE_GENERATION_FAILED.path,
               `Detail: ${formatError(combinedResult, NutritionalAssessmentService.name)}`,
            );
         }
         const globalDiagnosticVariable: GlobalDiagnosticVariable = { ...anthropometricVariableRes.val, ...clinicalVariable.val };
         const diagnosticRuleRes = await this.getAllDiagnosticRule();
         if (diagnosticRuleRes.isFailure)
            return handleDiagnosticCoreError(
               CORE_SERVICE_ERRORS.NUTRITIONAL_ASSESSMENT.DIAGNOSTIC_RULE_REPO_ERROR.path,
               `Detail: ${formatError(diagnosticRuleRes)}`,
            );
         const globalDiagnostics = this.interpretDiagnosticRules(diagnosticRuleRes.val, globalDiagnosticVariable);
         if (globalDiagnostics.isFailure) return Result.fail(formatError(globalDiagnostics, NutritionalAssessmentService.name));
         return Result.ok(globalDiagnostics.val);
      } catch (e: unknown) {
         return handleError(e);
      }
   }

   /**
    * Generates anthropometric variable object from patient data and optional growth indicators
    * @param patientData Patient diagnostic data
    * @param growthIndicatorValues Optional growth indicator values
    * @returns Promise containing anthropometric variable object
    */
   private async generateAnthropVariableObject(
      patientData: PatientDiagnosticData,
      growthIndicatorValues?: GrowthIndicatorValue[],
   ): Promise<Result<AnthropometricVariableObject>> {
      try {
         const context = this.generateContext(patientData);
         if (!growthIndicatorValues) return this.anthropService.generateAnthropometricVariableObject(patientData.getAnthropometricData(), context);
         const anthropometricVariableObjectRes = await this.anthropService.generateAnthropometricVariableObject(
            patientData.getAnthropometricData(),
            context,
         );
         if (anthropometricVariableObjectRes.isFailure) return anthropometricVariableObjectRes;
         const anthropometricVariableObject = anthropometricVariableObjectRes.val;
         for (const growthIndicatorValue of growthIndicatorValues) {
            const indicatorCode = growthIndicatorValue.unpack().code.unpack() as keyof AnthropometricVariableObject;
            const indicatorValueZScore = growthIndicatorValue.unpack().value;
            anthropometricVariableObject[indicatorCode] = indicatorValueZScore;
         }
         return Result.ok(anthropometricVariableObject);
      } catch (e: unknown) {
         return handleError(e);
      }
   }

   /**
    * Generates clinical variable object from clinical analysis results
    * @param clinicalAnalysis Clinical analysis results
    * @returns Promise containing clinical variable object
    */
   private async generateClinicalVariableObject(
      clinicalAnalysis: ClinicalNutritionalAnalysisResult[],
   ): Promise<Result<{ [key: string]: keyof typeof ConditionResult }>> {
      return this.clinicalVariableGenerator.generate(clinicalAnalysis);
   }

   /**
    * Retrieves all diagnostic rules from repository
    * @returns Promise containing array of diagnostic rules
    */
   private async getAllDiagnosticRule(): Promise<Result<DiagnosticRule[]>> {
      try {
         const diagnosticRules = await this.diagnosticRuleRepo.getAll();
         return Result.ok(diagnosticRules);
      } catch (e: unknown) {
         return handleError(e);
      }
   }

   /**
    * Interprets diagnostic rules using global variables
    * @param diagnosticRules Array of diagnostic rules to interpret
    * @param globalVariables Global variables for evaluation
    * @returns Result containing array of global diagnostics
    */
   private interpretDiagnosticRules(diagnosticRules: DiagnosticRule[], globalVariables: GlobalDiagnosticVariable): Result<GlobalDiagnostic[]> {
      try {
         const validateDiagnostic = diagnosticRules.filter((diagnosticRule) => {
            return diagnosticRule.getConditions().some((condition) => this.evaluateCondition(condition.value, globalVariables));
         });
         const globalDiagnostics = validateDiagnostic.map((rule) =>
            GlobalDiagnostic.create(
               rule.getCode(),
               rule.getConditions().map((condition) => condition.value),
            ),
         );
         const combinedResult = Result.combine(globalDiagnostics);
         if (combinedResult.isFailure) return Result.fail(formatError(combinedResult, NutritionalAssessmentService.name));
         return Result.ok(globalDiagnostics.map((diagnostic) => diagnostic.val));
      } catch (e: unknown) {
         return handleError(e);
      }
   }

   /**
    * Evaluates a single condition against global variables
    * @param condition Condition string to evaluate
    * @param globalVariables Global variables for evaluation
    * @returns Boolean indicating if condition is met
    */
   private evaluateCondition(condition: string, globalVariables: GlobalDiagnosticVariable): boolean {
      const conditionEvaluationResult = evaluateCondition(condition, globalVariables);
      return conditionEvaluationResult === ConditionResult.True;
   }
}
