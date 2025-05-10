import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreatePatientMonitoringResponse = Either<ExceptionBase | unknown, Result<{ id: AggregateID }>>;
