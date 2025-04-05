import { AggregateID } from "@shared";
import { GrowthIndicatorValueDto } from "../anthropometric";
import { BiologicalAnalysisInterpretationDto } from "../biological";
import { GlobalDiagnosticDto } from "./GlobalDiagnosticDto";

export interface NutritionalAssessmentResultDto {
   id: AggregateID;
   growthIndicatorValues: GrowthIndicatorValueDto[];
   biologicalInterpretation: BiologicalAnalysisInterpretationDto[];
   globalDiagnostics: GlobalDiagnosticDto[];
   createdAt: string;
   updatedAt: string;
}
