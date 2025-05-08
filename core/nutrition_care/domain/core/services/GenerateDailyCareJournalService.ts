import { Result } from "@shared";
import { PatientCurrentState, DailyCareJournal } from "../models";
import { IGenerateDailyCareJournalService } from "../ports/primary";

export class GenerateDailyCareJournalService implements IGenerateDailyCareJournalService {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    generate(patientCurrentState: PatientCurrentState): Promise<Result<DailyCareJournal>> {
        throw new Error("Method not implemented.");
    }
    
}