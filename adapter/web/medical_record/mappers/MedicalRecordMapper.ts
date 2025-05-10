import { DataFieldResponse, MedicalRecord } from "@core/medical_record/domain";
import { formatError, InfraMapToDomainError, InfrastructureMapper, Result } from "@core/shared";
import { AnthropometricData, BiologicalValue, ClinicalSignData, ComplicationData } from "@core/medical_record/domain";
import { MedicalRecordPersistenceDto } from "./../persistenceDto";

export class MedicalRecordMapper implements InfrastructureMapper<MedicalRecord, MedicalRecordPersistenceDto> {
   toPersistence(entity: MedicalRecord): MedicalRecordPersistenceDto {
      return {
         id: entity.id as string,
         patientId: entity.getPatientId() as string,
         anthropometricData: entity.getAnthropometricData().map((data) => ({
            code: data.code.unpack(),
            context: data.context,
            recordedAt: data.recordedAt.unpack(),
            unit: data.unit.unpack(),
            value: data.value,
         })),
         biologicalData: entity.getBiologicalData().map((data) => ({
            code: data.code.unpack(),
            recordedAt: data.recordedAt.unpack(),
            unit: data.unit.unpack(),
            value: data.value,
         })),
         clinicalData: entity.getClinicalData().map((data) => ({
            code: data.code.unpack(),
            data: data.data,
            recordedAt: data.recordedAt.unpack(),
         })),
         complications: entity.getComplicationData().map((comp) => ({
            code: comp.code.unpack(),
            recordedAt: comp.recordedAt.unpack(),
            isPresent: comp.isPresent,
         })),
         dataFieldsResponse: entity.getDataFields().map((data) => ({
            code: data.code.unpack(),
            recordedAt: data.recodedAt.unpack(),
            type: data.type,
            value: data.value,
            unit: data.unit?.unpack(),
         })),
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }

   toDomain(record: MedicalRecordPersistenceDto): MedicalRecord {
      // Convert anthropometric data
      const anthropometricDataResults = record.anthropometricData.map(AnthropometricData.create);

      // Convert biological data
      const biologicalDataResults = record.biologicalData.map(BiologicalValue.create);

      // Convert clinical data
      const clinicalDataResults = record.clinicalData.map(ClinicalSignData.create);

      // Convert complications
      const complicationResults = record.complications.map(ComplicationData.create);

      // Convert dataFields
      const dataFieldsResults = record.dataFieldsResponse.map(DataFieldResponse.create);

      // Combine all results
      const combinedRes = Result.combine([
         ...anthropometricDataResults,
         ...biologicalDataResults,
         ...clinicalDataResults,
         ...complicationResults,
         ...dataFieldsResults,
      ]);

      if (combinedRes.isFailure) {
         throw new InfraMapToDomainError(formatError(combinedRes, MedicalRecordMapper.name));
      }

      return new MedicalRecord({
         id: record.id,
         createdAt: record.createdAt,
         updatedAt: record.updatedAt,
         props: {
            patientId: record.patientId,
            anthropometricData: anthropometricDataResults.map((r) => r.val),
            biologicalData: biologicalDataResults.map((r) => r.val),
            clinicalData: clinicalDataResults.map((r) => r.val),
            complications: complicationResults.map((r) => r.val),
            complicationData: complicationResults.map((r) => r.val),
            dataFieldsResponse: dataFieldsResults.map((r) => r.val),
         },
      });
   }
}
