import { Either, ExceptionBase, Result } from "@shared";

export type DeletePatientMonitoringResponse = Either<ExceptionBase | unknown, Result<void>>;
