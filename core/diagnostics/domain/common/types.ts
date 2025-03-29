import { Sex } from "@shared";

export interface ValidateResult {
   isValid: boolean;
   info?: {
      field: "Anthropometric" | "Clinical" | "Biochemical";
      fieldName: string;
      indication: string;
      error: string;
   };
}

export interface EvaluationContext {
   age_in_month: number;
   age_in_year: number;
   age_in_day: number;
   sex: Sex;
}
