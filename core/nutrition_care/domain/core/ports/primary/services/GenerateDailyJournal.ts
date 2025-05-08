import { Result } from "@shared";
import { DailyCareJournal, PatientCurrentState } from "../../../models";

export interface IGenerateDailyCareJournalService {
   generate(patientCurrentState: PatientCurrentState): Promise<Result<DailyCareJournal>>;
}
