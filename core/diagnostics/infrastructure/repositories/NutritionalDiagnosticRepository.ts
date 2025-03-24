import { AggregateID, Repository } from "@shared";
import { NutritionalDiagnostic } from "../../domain/models";

export interface NutritionalDiagnosticReference extends Repository<NutritionalDiagnostic> {
   getByPatient(patientId: AggregateID): Promise<NutritionalDiagnostic>;
}
