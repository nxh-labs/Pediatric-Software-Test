import { ApplicationMapper } from "@shared";
import { PatientCareSession } from "../../domain";
import { PatientCareSessionDto } from "../dtos";
import { CarePhaseMapper } from "./CarePhaseMapper";
import { PatientCurrentStateMapper } from "./PatientCurrentStateMapper";
import { DailyCareJournalMapper } from "./DailyCareJournalMapper";

export class PatientCareSessionMapper implements ApplicationMapper<PatientCareSession, PatientCareSessionDto> {
   constructor(
      private carePhaseMapper: CarePhaseMapper,
      private currentState: PatientCurrentStateMapper,
      private dailyJournal: DailyCareJournalMapper,
   ) {}
   toResponse(entity: PatientCareSession): PatientCareSessionDto {
      const { carePhases, orientation, currentState, dailyJournals, currentDailyJournal, status } = entity.getProps();
      return {
         id: entity.id,
         patientId: entity.getPatientId(),
         carePhases: carePhases.map(this.carePhaseMapper.toResponse),
         orientation: orientation,
         startDate: entity.getStartDate(),
         currentState: this.currentState.toResponse(currentState),
         dailyJournals: dailyJournals.map(this.dailyJournal.toResponse),
         currentDailyJournal: currentDailyJournal ? this.dailyJournal.toResponse(currentDailyJournal) : undefined,
         status: status,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
}
