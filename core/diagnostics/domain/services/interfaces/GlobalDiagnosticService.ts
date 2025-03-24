import { Result } from "@shared";
import { GlobalDiagnostic, PatientDiagnosticData } from "../../models";


/**
 * @interface IGlobalDiagnosticService - Gere la generation du diagnostic global 
 * ```typescript
  class GlobalDiagnosticService {
   <<Service>>
   +makeGlobalDiagnostic(PatientDiagnosticData,GrowthIndicatorValue[],MicronutrientDeficiency[],BiologicalAnalysisInterpretation[],DiagnosticRule[]) GlobalDiagnostic

   }
   ```
 */
export interface IGlobalDiagnosticService {
   makeGlobalDiagnostic(patientDiagnosticData: PatientDiagnosticData): Promise<Result<GlobalDiagnostic>>;
}
