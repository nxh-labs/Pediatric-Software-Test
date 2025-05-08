import { AggregateRoot, DomainDate, EntityPropsBaseType } from "@shared";
import { OrientationResult } from "../../../modules";
import { CarePhase, DailyCareJournal, PatientCurrentState } from "../entities";

export interface IPatientCareSession extends EntityPropsBaseType {
   patientId: string;
   startDate: DomainDate;
   endDate?: DomainDate;
   orientation: OrientationResult;
   carePhases: CarePhase[];
   currentPhase: CarePhase;
   currentState: PatientCurrentState;
   dailyJournals: DailyCareJournal[];
   status: "in_progress" | "completed";
}

export class PatientCareSession extends AggregateRoot<IPatientCareSession> {
   public validate(): void {
      throw new Error("Method not implemented.");
   }
}
