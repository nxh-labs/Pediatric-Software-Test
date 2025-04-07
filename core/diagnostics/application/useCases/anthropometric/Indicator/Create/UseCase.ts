import { GenerateUniqueId, handleError, left, Result, right, UseCase } from "@shared";
import { CreateIndicatorRequest } from "./Request";
import { CreateIndicatorResponse } from "./Response";
import { Indicator, IndicatorRepository } from "../../../../../domain";

export class CreateIndicatorUseCase implements UseCase<CreateIndicatorRequest, CreateIndicatorResponse> {
   constructor(private readonly idGenerator: GenerateUniqueId, private readonly indicatorRepo: IndicatorRepository) {}
   async execute(request: CreateIndicatorRequest): Promise<CreateIndicatorResponse> {
      try {
         const indicatorId = this.idGenerator.generate().toString();
         const indicator = Indicator.create(request.data, indicatorId);
         if (indicator.isFailure) return left(indicator);
         indicator.val.created();
         await this.indicatorRepo.save(indicator.val);
         return right(Result.ok({ id: indicatorId }));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
