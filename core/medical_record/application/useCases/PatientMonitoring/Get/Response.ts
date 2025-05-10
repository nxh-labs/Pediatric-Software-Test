import { Either, ExceptionBase, Result } from "@shared";
import { PatientMonitoringDto } from "../../../dtos";

export type GetPatientMonitoringResponse = Either<ExceptionBase | unknown, Result<PatientMonitoringDto>>;
