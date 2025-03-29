import { Result } from "@shared";
import { ValidateResult } from "../../common";
import { BiologicalTestResult, BiochemicalReference, BiologicalAnalysisInterpretation } from "../models";
import { IBiologicalService } from "../ports/primary";

export class BiologicalService implements IBiologicalService {
    identifyPossibleSign(data: BiologicalTestResult): Promise<Result<BiochemicalReference[]>> {
        throw new Error("Method not implemented.");
    }
    getBiologicalAnalysisInterpretation(data: BiologicalTestResult): Promise<Result<BiologicalAnalysisInterpretation[]>> {
        throw new Error("Method not implemented.");
    }
    validateBiological(data: BiologicalTestResult): Promise<ValidateResult> {
        throw new Error("Method not implemented.");
    }
    
}