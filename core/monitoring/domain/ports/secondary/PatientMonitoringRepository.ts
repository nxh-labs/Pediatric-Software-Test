import { AggregateID, Repository } from "@shared";
import { PatientMonitoring } from "../../models";

export interface PatientMonitoringRepository extends Repository<PatientMonitoring> {
   getByPatientId(patientId: AggregateID): Promise<PatientMonitoring>;
}
