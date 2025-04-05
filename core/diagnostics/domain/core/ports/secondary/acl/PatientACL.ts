import { AggregateID, Birthday, Gender } from "@shared";

export interface PatientInfo {
   id: AggregateID
   birthday: Birthday
   gender: Gender
}
export interface PatientACL {
   getAllPatientIds(): Promise<AggregateID[]>;
   getPatientInfo(patientID: AggregateID): Promise<PatientInfo>;
}
