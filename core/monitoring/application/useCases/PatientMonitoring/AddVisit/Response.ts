import { Either, ExceptionBase, Result } from "@shared";

export type AddVisitToPatientMonitoringResponse = Either<ExceptionBase | unknown, Result<void>>;
