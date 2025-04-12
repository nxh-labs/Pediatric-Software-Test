import { AggregateID, Result } from "@shared";
import { VisitMeasurement } from "../../../models";

export interface MeasurementValidationACL {
   validate(patientId: AggregateID, measurement: VisitMeasurement): Promise<Result<boolean>>;
}
