import { AggregateID } from "@shared";
import { IDiagnosticCondition } from "../../../domain";

export interface DiagnosticRuleDto {
   id: AggregateID;
   name: string;
   code: string;
   condition: IDiagnosticCondition[];
   createdAt: string;
   updatedAt: string;
}
