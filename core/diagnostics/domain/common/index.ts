export interface ValidateResult {
    isValid: boolean;
    info?: {
       field: "Anthropometric" | "Clinical" | "Biochemical";
       fieldName: string;
       indication: string;
       error: string;
    };
 }