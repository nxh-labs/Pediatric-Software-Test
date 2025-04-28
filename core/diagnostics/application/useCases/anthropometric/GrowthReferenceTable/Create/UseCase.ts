import { GenerateUniqueId, handleError, left, Result, right, UseCase } from "@shared";
import { CreateGrowthReferenceTableRequest } from "./Request";
import { CreateGrowthReferenceTableResponse } from "./Response";
import { GrowthReferenceTable, GrowthReferenceTableRepository } from "../../../../../domain";

export class CreateGrowthReferenceTableUseCase implements UseCase<CreateGrowthReferenceTableRequest, CreateGrowthReferenceTableResponse> {
   constructor(private readonly idGenerator: GenerateUniqueId, private readonly repo: GrowthReferenceTableRepository) {}
   async execute(request: CreateGrowthReferenceTableRequest): Promise<CreateGrowthReferenceTableResponse> {
      try {
         const growthRefTableId = this.idGenerator.generate().toValue();
         const growthRefTableRes = GrowthReferenceTable.create(request.data, growthRefTableId);
         if (growthRefTableRes.isFailure) return left(growthRefTableRes);
         growthRefTableRes.val.created();
         await this.repo.save(growthRefTableRes.val);
         return right(Result.ok({ id: growthRefTableId }));
      } catch (e) {
         return left(handleError(e));
      }
   }
}
