import { AggregateID } from "@shared";

export interface PatientALC {
   getAllPatientIds(): Promise<AggregateID[]>;
   getPatientInfo(): Promise<void>;
}
