import { Repository, SystemCode } from "@shared";
import { Indicator } from "../../domain/models";

export interface IndicatorRepository extends Repository<Indicator> {
   getAll(): Promise<Indicator[]>;
   getByCode(code: SystemCode): Promise<Indicator>;
   getAllCode(): Promise<SystemCode[]>;
}
