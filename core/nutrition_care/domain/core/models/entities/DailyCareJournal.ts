import { DomainDate, Entity, EntityPropsBaseType } from "@shared";
import { CareDecision, ClinicalEvent, MonitoringEntry, NutritionalTreatmentAction } from "../valueObjects";


export interface IDailyCareJournal extends EntityPropsBaseType {
   date: DomainDate;
   dayNumber: number;
   monitoringValues: MonitoringEntry[];
   observations: ClinicalEvent[];
   treatmentActions: NutritionalTreatmentAction[];
   careDecisions: CareDecision[];
}

export class DailyCareJournal extends Entity<IDailyCareJournal> {
   public validate(): void {
      this._isValid = false;
      this._isValid = true;
   }
}
