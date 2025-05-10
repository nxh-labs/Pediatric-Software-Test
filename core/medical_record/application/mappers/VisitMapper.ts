import { ApplicationMapper } from "@shared";
import { VisitDto } from "../dtos";
import { CreateVisitMeasurementProps, IVisitMeasurement, Visit } from "../../domain";

export class VisitMapper implements ApplicationMapper<Visit, VisitDto> {
   toResponse(entity: Visit): VisitDto {
      return {
         id: entity.id,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
         date: entity.getDate(),
         visitPurpose: entity.getPurpose(),
         observerId: entity.getObserverId(),
         notes: entity.getNotes(),
         measurement: this.measurementToDto(entity.getMeasurement()),
      };
   }
   private measurementToDto(measurement: IVisitMeasurement): CreateVisitMeasurementProps {
      return {
         anthropometricMeasures: measurement.anthropometricMeasures.map((entry) => ({
            code: entry.code.unpack(),
            value: entry.value,
            unit: entry.unit.unpack(),
         })),
         biologicalResults: measurement.biologicalResults.map((entry) => ({
            code: entry.code.unpack(),
            value: entry.value,
            unit: entry.unit.unpack(),
         })),
         clinicalData: {
            edema: { code: measurement.clinicalData.edema.code.unpack(), data: measurement.clinicalData.edema.data },
            otherSigns: measurement.clinicalData.otherSigns.map((entry) => ({
               code: entry.code.unpack(),
               data: entry.data,
            })),
         },
      };
   }
}
