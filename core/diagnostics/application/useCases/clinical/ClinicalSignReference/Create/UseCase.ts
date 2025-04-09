import { GenerateUniqueId, handleError, left, Result, right, UseCase } from "@shared";
import { CreateClinicalSignReferenceRequest } from "./Request";
import { CreateClinicalSignReferenceResponse } from "./Response";
import { ClinicalSignReference, ClinicalSignReferenceRepository } from "../../../../../domain";

export class CreateClinicalSignReferenceUseCase implements UseCase<CreateClinicalSignReferenceRequest, CreateClinicalSignReferenceResponse> {
   constructor(private readonly idGenerator: GenerateUniqueId, private readonly repo: ClinicalSignReferenceRepository) {}
   async execute(request: CreateClinicalSignReferenceRequest): Promise<CreateClinicalSignReferenceResponse> {
      try {
         const clinicalSignRefId = this.idGenerator.generate().toValue();
         const clinicalSignRefResult = ClinicalSignReference.create(request.data, clinicalSignRefId);
         if (clinicalSignRefResult.isFailure) return left(clinicalSignRefResult);
         clinicalSignRefResult.val.created();
         await this.repo.save(clinicalSignRefResult.val);
         return right(Result.ok({ id: clinicalSignRefId }));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
