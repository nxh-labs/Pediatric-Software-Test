import { Either, ExceptionBase, Result } from "@shared";
import { APPETITE_TEST_RESULT_CODES } from "../../../../../domain";

export type EvaluatePatientAppetiteResponse = Either<ExceptionBase | unknown, Result<{ code: string; result: APPETITE_TEST_RESULT_CODES }>>;
