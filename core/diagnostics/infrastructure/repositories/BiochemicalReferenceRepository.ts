import { Repository, SystemCode } from "@shared";
import { BiochemicalReference } from "../../domain/models";

export interface BiochemicalReferenceRepository extends Repository<BiochemicalReference> {
   getByCode(code: SystemCode): Promise<BiochemicalReference>;
   getAll(): Promise<BiochemicalReference[]>;
   getAllCode(): Promise<SystemCode[]>;
}
