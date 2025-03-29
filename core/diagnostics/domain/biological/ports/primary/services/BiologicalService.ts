import { Result } from "@shared";
import { BiologicalTestResult, BiochemicalReference, BiologicalAnalysisInterpretation } from "../../../models";
import { ValidateResult } from "../../../../common";


export interface IBiologicalService {
   identifyPossibleSign(data: BiologicalTestResult): Promise<Result<BiochemicalReference[]>>;
   getBiologicalAnalysisInterpretation(data: BiologicalTestResult): Promise<Result<BiologicalAnalysisInterpretation[]>>;
   validateBiological(data:BiologicalTestResult): Promise<ValidateResult>;
}
