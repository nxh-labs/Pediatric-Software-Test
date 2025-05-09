import { GenerateUniqueId, handleError, left, Result, right, UseCase } from "@shared";
import { CreateComplicationRequest } from "./Request";
import { CreateComplicationResponse } from "./Response";
import { Complication, ComplicationRepository } from "../../../../domain";

export class CreateComplicationUseCase implements UseCase<CreateComplicationRequest, CreateComplicationResponse> {
   constructor(private readonly idGenerator: GenerateUniqueId, private readonly repo: ComplicationRepository) {}
async execute(request: CreateComplicationRequest): Promise<CreateComplicationResponse> {
    try {
        // Generate a unique identifier up front for clarity
        const newId = this.idGenerator.generate().toValue();
        const creationResult = Complication.create(request.data, newId);
        if (creationResult.isFailure) {
            return left(creationResult);
        }
        const complication = creationResult.val;
        // Optionally register the creation timestamp or perform any side effects
        complication.created();
        await this.repo.save(complication);
        return right(Result.ok({ id: complication.id }));
    } catch (error: unknown) {
        return left(handleError(error));
    }
}
}
