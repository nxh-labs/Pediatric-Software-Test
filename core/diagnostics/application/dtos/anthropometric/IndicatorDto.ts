import { AggregateID } from "@shared";
import { ICondition, IFormula, ZScoreComputingStrategyType } from "../../../domain";
import { AvailableChartDto } from "./AvailableChartDto";
import { IndicatorInterpreterDto } from "./IndicatorInterpreterDto";

export interface IndicatorDto {
   id: AggregateID;
   code: string;
   name: string;
   neededMeasureCodes: string[];
   axeX: IFormula;
   axeY: IFormula;
   availableRefCharts: AvailableChartDto[];
   usageConditions: ICondition;
   interpretations: IndicatorInterpreterDto[];
   zScoreComputingStrategy: ZScoreComputingStrategyType;
   createdAt: string;
   updatedAt: string;
}
