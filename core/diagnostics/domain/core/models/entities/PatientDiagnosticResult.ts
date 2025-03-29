import { AggregateID, Entity, EntityPropsBaseType, handleError, Result } from "@shared";
import { GrowthIndicatorValue, CreateGrowthIndicatorValueProps } from "../../../anthropometry";
import { BiologicalAnalysisInterpretation } from "../../../biological";
import { MicronutrientDeficiency, CreateMicronutrientDeficiency } from "../../../clinical";
import { GlobalDiagnostic } from "../valueObjects";

export interface IPatientDiagnosticResult extends EntityPropsBaseType {
   growthIndicatorValues: GrowthIndicatorValue[];
   suspectedDeficiencies: MicronutrientDeficiency[];
   biologicalAnalysisInterpretation: BiologicalAnalysisInterpretation[];
   globalDiagnostic: GlobalDiagnostic;
}
export type CreatePatientDiagnosticResult = {
   globalDiagnostic: { code: string; criteriaUsed: string[] };
   growthIndicatorValues: CreateGrowthIndicatorValueProps[];
   suspectedDeficiencies: CreateMicronutrientDeficiency[];
   biologicalAnalysisInterpretation: { code: string; interpretation: string }[];
};

export class PatientDiagnosticResult extends Entity<IPatientDiagnosticResult> {
   getGrowthIndicatorValues(): GrowthIndicatorValue[] {
      return this.props.growthIndicatorValues;
   }
   getSuspectedDeficiencies(): MicronutrientDeficiency[] {
      return this.props.suspectedDeficiencies;
   }
   getBiologicalAnalysisInterpretation(): BiologicalAnalysisInterpretation[] {
      return this.props.biologicalAnalysisInterpretation;
   }
   getGlobalDiagnostic(): GlobalDiagnostic {
      return this.props.globalDiagnostic;
   }
   changeGlobalDiagnostic(globalDiagnostic: GlobalDiagnostic) {
      this.props.globalDiagnostic = globalDiagnostic;
      this.validate();
   }
   addGrowthIndicatorValues(...growthIndicatorValues: GrowthIndicatorValue[]) {
      for (const growthIndicatorValue of growthIndicatorValues) {
         const growthIndicatorValueIndex = this.props.growthIndicatorValues.findIndex(
            (growthInd) => growthInd.unpack().code === growthIndicatorValue.unpack().code,
         );
         if (growthIndicatorValueIndex != -1) this.props.growthIndicatorValues[growthIndicatorValueIndex] = growthIndicatorValue;
         else this.props.growthIndicatorValues.push(growthIndicatorValue);
      }
      this.validate();
   }
   addMicronutrientDeficiencies(...micronutrientDeficiencies: MicronutrientDeficiency[]) {
      for (const micronutrient of micronutrientDeficiencies) {
         const micronutrientDeficiencyIndex = this.props.suspectedDeficiencies.findIndex(
            (microNut) => microNut.unpack().code === micronutrient.unpack().code,
         );
         if (micronutrientDeficiencyIndex != -1) this.props.suspectedDeficiencies[micronutrientDeficiencyIndex] = micronutrient;
         else this.props.suspectedDeficiencies.push(micronutrient);
      }
      this.validate();
   }
   addBiologicalAnalysisInterpretations(...biologicalAnalysis: BiologicalAnalysisInterpretation[]) {
      for (const biologicalAnalyze of biologicalAnalysis) {
         const biologicalAnalyzeIndex = this.props.biologicalAnalysisInterpretation.findIndex(
            (bioAna) => bioAna.unpack().code === biologicalAnalyze.unpack().code,
         );
         if (biologicalAnalyzeIndex != -1) this.props.biologicalAnalysisInterpretation[biologicalAnalyzeIndex] = biologicalAnalyze;
         else this.props.biologicalAnalysisInterpretation.push(biologicalAnalyze);
      }
      this.validate();
   }

   removeGrowthIndicatorValue(...growthIndicatorValues: GrowthIndicatorValue[]) {
      for (const growthIndicatorValue of growthIndicatorValues) {
         const index = this.props.growthIndicatorValues.findIndex((growthInd) => growthInd.unpack().code.equals(growthIndicatorValue.unpack().code));
         if (index !== -1) this.props.growthIndicatorValues.splice(index, 1);
      }
      this.validate();
   }

   removeMicronutrientDeficiency(...micronutrientDeficiencies: MicronutrientDeficiency[]) {
      for (const micronutrient of micronutrientDeficiencies) {
         const index = this.props.suspectedDeficiencies.findIndex((deficiency) => deficiency.unpack().code.equals(micronutrient.unpack().code));
         if (index !== -1) this.props.suspectedDeficiencies.splice(index, 1);
      }
      this.validate();
   }

   removeBiologicalAnalysisInterpretation(...biologicalInterpretations: BiologicalAnalysisInterpretation[]) {
      for (const biologicalInterpretation of biologicalInterpretations) {
         const index = this.props.biologicalAnalysisInterpretation.findIndex((analysis) =>
            analysis.unpack().code.equals(biologicalInterpretation.unpack().code),
         );
         if (index !== -1) this.props.biologicalAnalysisInterpretation.splice(index, 1);
      }
      this.validate();
   }

   public validate(): void {
      // Write a validation code if it's need I
      this._isValid = true;
   }
   static create(createProps: CreatePatientDiagnosticResult, id: AggregateID): Result<PatientDiagnosticResult> {
      try {
         const globalDiagnosticRes = GlobalDiagnostic.create(createProps.globalDiagnostic.code, createProps.globalDiagnostic.criteriaUsed);
         const growthIndicatorValuesRes = createProps.growthIndicatorValues.map(GrowthIndicatorValue.create);
         const suspectedDeficienciesRes = createProps.suspectedDeficiencies.map(MicronutrientDeficiency.create);
         const biologicalAnalysisInterpretationRes = createProps.biologicalAnalysisInterpretation.map((bioAnalysis) =>
            BiologicalAnalysisInterpretation.create(bioAnalysis.code, bioAnalysis.interpretation),
         );
         const combinedRes = Result.combine([
            globalDiagnosticRes,
            ...growthIndicatorValuesRes,
            ...suspectedDeficienciesRes,
            ...biologicalAnalysisInterpretationRes,
         ]);
         if (combinedRes.isFailure) return Result.fail(String(combinedRes.err));
         return Result.ok(
            new PatientDiagnosticResult({
               id,
               props: {
                  globalDiagnostic: globalDiagnosticRes.val,
                  growthIndicatorValues: growthIndicatorValuesRes.map((valRes) => valRes.val),
                  suspectedDeficiencies: suspectedDeficienciesRes.map((valRes) => valRes.val),
                  biologicalAnalysisInterpretation: biologicalAnalysisInterpretationRes.map((valRes) => valRes.val),
               },
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
