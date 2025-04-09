import { GenerateUniqueId, handleError, left, Result, right, UseCase } from "@shared";
import { CreateBiochemicalReferenceRequest } from "./Request";
import { CreateBiochemicalReferenceResponse } from "./Response";
import { BiochemicalReference, BiochemicalReferenceRepository } from "../../../../../domain";

export class CreateBiochemicalReferenceUseCase implements UseCase<CreateBiochemicalReferenceRequest, CreateBiochemicalReferenceResponse> {
   constructor(private readonly idGenerator: GenerateUniqueId, private readonly repo: BiochemicalReferenceRepository) {}
   async execute(request: CreateBiochemicalReferenceRequest): Promise<CreateBiochemicalReferenceResponse> {
      try {
         const biochemicalRefId = this.idGenerator.generate().toValue();
         const biochemicalRefRes = BiochemicalReference.create(request.data, biochemicalRefId);
         if (biochemicalRefRes.isFailure) return left(biochemicalRefRes);
         biochemicalRefRes.val.created();
         await this.repo.save(biochemicalRefRes.val);
         return right(Result.ok({ id: biochemicalRefId }));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
