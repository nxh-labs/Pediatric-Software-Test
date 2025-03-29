import { AggregateID, EntityPropsBaseType, Factory, GenerateUniqueId, Result } from "@shared";
import { NutritionalDiagnostic } from "../models";
export interface CreateNutritionalDiagnosticProps extends EntityPropsBaseType {
   patientId: AggregateID;
}
export class NutritionalDiagnosticFactory implements Factory<CreateNutritionalDiagnosticProps, NutritionalDiagnostic> {
   constructor(private idGenerator: GenerateUniqueId) {}
   create(props: CreateNutritionalDiagnosticProps): Result<NutritionalDiagnostic> | Promise<Result<NutritionalDiagnostic>> {
      throw new Error("Method not implemented.");
   }
}
