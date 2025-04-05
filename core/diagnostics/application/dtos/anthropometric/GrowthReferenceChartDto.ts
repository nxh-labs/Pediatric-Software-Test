import { Sex } from "@shared";
import { GrowthStandard } from "../../../domain";
import { ChartDataDto } from "./ChartDataDto";

export interface GrowthReferenceChartDto {
   id: string;
   code: string;
   name: string;
   standard: GrowthStandard;
   sex: Sex;
   data: ChartDataDto[];
   createdAt: string;
   updatedAt: string;
}
