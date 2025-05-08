import { AggregateID, Repository } from "@shared";
import { PatientCareSession } from "../../../models";

export interface PatientCareSessionRepository extends Repository<PatientCareSession> {
   getByPatientId(patientId: AggregateID): Promise<PatientCareSession>;
}
