import { Repository, SystemCode } from "@shared";
import { DiagnosticRule } from "../../domain/models";

export interface DiagnosticRuleRepository extends Repository<DiagnosticRule> {
   getByCode(code: SystemCode): Promise<DiagnosticRule>;
   getAll(): Promise<DiagnosticRule[]>;
   getAllCode(): Promise<SystemCode[]>;
}
