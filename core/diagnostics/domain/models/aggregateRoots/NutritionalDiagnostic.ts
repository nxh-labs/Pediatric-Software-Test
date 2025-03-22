import { AggregateID } from "@shared";
import { PatientDiagnosticResult, PatientDiagnosticData } from "../entities";

export interface INutritionalDiagnostic {
    patientId: AggregateID
    patientData: PatientDiagnosticData
    result: PatientDiagnosticResult
    date:Date,

}