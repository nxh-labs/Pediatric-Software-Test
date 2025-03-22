import { Entity, EntityPropsBaseType } from "@shared";
import {
  BiologicalAnalysisInterpretation,
  GlobalDiagnostic,
  GrowthIndicatorValue,
  MicronutrientDeficiency,
} from "../valueObjects";

export interface IPatientDiagnosticResult extends EntityPropsBaseType {
  growthIndicatorValues: GrowthIndicatorValue[];
  suspectedDeficiencies: MicronutrientDeficiency[];
  biologicalAnalysisInterpretation: BiologicalAnalysisInterpretation[];
  globalDiagnostic: GlobalDiagnostic;
}

export class PatientDiagnosticResult extends Entity<IPatientDiagnosticResult> {
  public validate(): void {
    throw new Error("Method not implemented.");
  }
}
