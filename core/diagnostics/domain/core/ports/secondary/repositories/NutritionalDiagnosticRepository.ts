import { AggregateID, Repository } from "@shared";
import { NutritionalDiagnostic } from "../../../models";

export interface NutritionalDiagnosticReference extends Repository<NutritionalDiagnostic> {
   getByPatient(patientId: AggregateID): Promise<NutritionalDiagnostic[]>;
}
