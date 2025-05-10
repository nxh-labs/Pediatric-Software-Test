import { ApplicationMapper } from "@shared";
import { PatientMonitoring, Visit } from "../../domain";
import { PatientMonitoringDto, VisitDto } from "../dtos";

export class PatientMonitoringMapper implements ApplicationMapper<PatientMonitoring, PatientMonitoringDto> {
   constructor(private readonly visitMapper: ApplicationMapper<Visit, VisitDto>) {}
   toResponse(entity: PatientMonitoring): PatientMonitoringDto {
      return {
         id: entity.id,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
         patientId: entity.getPatientId(),
         visits: entity.getProps().visits.map(this.visitMapper.toResponse),
      };
   }
}
