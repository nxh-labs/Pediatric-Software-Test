import { GenerateUniqueId, handleError, left, Result, right, UseCase } from "@shared";
import { CreateMedicineRequest } from "./Request";
import { CreateMedicineResponse } from "./Response";
import { Medicine, MedicineRepository } from "../../../../domain";

export class CreateMedicineUseCase implements UseCase<CreateMedicineRequest, CreateMedicineResponse> {
   constructor(private readonly idGenerator: GenerateUniqueId, private readonly repo: MedicineRepository) {}
   async execute(request: CreateMedicineRequest): Promise<CreateMedicineResponse> {
      try {
         const newId = this.idGenerator.generate().toValue();
         const medicineRes = Medicine.create(request.data, newId);
         if (medicineRes.isFailure) return left(medicineRes);

         const medicine = medicineRes.val;
         
         medicine.created();
         await this.repo.save(medicine);
         return right(Result.ok({ id: newId }));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
