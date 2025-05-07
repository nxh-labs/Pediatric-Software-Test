import { AggregateID } from "@shared";
import { AnthroSystemCodes, BIOCHEMICAL_REF_CODES, CLINICAL_SIGNS, ConditionResult } from "../../../../../constants";
import { APPETITE_TEST_CODES, APPETITE_TEST_RESULT_CODES } from "../../../modules";

export interface IPatientNutritionCare {
   patientId: AggregateID;
   anthropometricData: Record<(typeof AnthroSystemCodes)[keyof typeof AnthroSystemCodes], number>;
   clinicalSignData: Record<(typeof CLINICAL_SIGNS)[keyof typeof CLINICAL_SIGNS], (typeof ConditionResult)[keyof typeof ConditionResult]>;
   biologicalData: Record<(typeof BIOCHEMICAL_REF_CODES)[keyof typeof BIOCHEMICAL_REF_CODES], number>;
   appetiteTestResult: { [APPETITE_TEST_CODES.CODE]: APPETITE_TEST_RESULT_CODES };
   complicationData: Record<string, number>;
}
