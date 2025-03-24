import { Repository, SystemCode } from "@shared";
import { AnthropometricMeasure } from "../../domain/models";

export interface AnthropometricMeasureRepository extends Repository<AnthropometricMeasure> {
   getByCode(code: SystemCode): Promise<AnthropometricMeasure>;
   getAll(): Promise<AnthropometricMeasure[]>;
   getAllCode(): Promise<SystemCode[]>;
}
