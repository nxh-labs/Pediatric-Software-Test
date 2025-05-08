import { DomainDate } from "@shared";
import { OrientationResult } from "../../../modules";
import { CarePhase, DailyCareJournal } from "../entities";

export interface IPatientCareSession {
   startDate: DomainDate;
   endDate?: DomainDate;
   patientId: string;
   orientation: OrientationResult;
   carePhases: CarePhase[];
   currentPhase: CarePhase;
   dailyJournals: DailyCareJournal[];
   status: "in_progress" | "completed";
}
