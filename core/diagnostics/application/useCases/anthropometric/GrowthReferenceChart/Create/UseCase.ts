import { GenerateUniqueId, handleError, left, Result, right, UseCase } from "@shared";
import { CreateGrowthReferenceChartRequest } from "./Request";
import { CreateGrowthReferenceChartResponse } from "./Response";
import { GrowthReferenceChart, GrowthReferenceChartRepository } from "../../../../../domain";

export class CreateGrowthReferenceChartUseCase implements UseCase<CreateGrowthReferenceChartRequest, CreateGrowthReferenceChartResponse> {
   constructor(private readonly idGenerator: GenerateUniqueId, private readonly repo: GrowthReferenceChartRepository) {}
   async execute(request: CreateGrowthReferenceChartRequest): Promise<CreateGrowthReferenceChartResponse> {
      try {
         const growthReferenceChartId = this.idGenerator.generate().toValue();
         const growthReferenceChart = GrowthReferenceChart.create(request.data, growthReferenceChartId);
         if (growthReferenceChart.isFailure) return left(growthReferenceChart);
         growthReferenceChart.val.created();
         await this.repo.save(growthReferenceChart.val);
         return right(Result.ok({ id: growthReferenceChartId }));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
