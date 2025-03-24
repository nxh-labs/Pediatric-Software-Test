import { Repository, SystemCode } from "@shared";
import { ClinicalSignReference } from "../../domain/models";

export interface ClinicalSignReferenceRepository extends Repository<ClinicalSignReference> {
   getByCode(code: SystemCode): Promise<ClinicalSignReference>;
   getAll(): Promise<ClinicalSignReference[]>;
   getAllCode(): Promise<SystemCode[]>;
}
