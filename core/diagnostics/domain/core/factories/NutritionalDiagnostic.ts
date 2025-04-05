import { AggregateID, DomainDate, EntityPropsBaseType, Factory, formatError, GenerateUniqueId, handleError, Result } from "@shared";
import { CreatePatientDiagnosticData, NutritionalDiagnostic, PatientDiagnosticData } from "../models";
import { IPatientDataValidationService, PatientACL, PatientInfo } from "../ports";
import { CORE_SERVICE_ERRORS, handleDiagnosticCoreError } from "../errors";
export interface CreateNutritionalDiagnosticProps extends EntityPropsBaseType {
   patientId: AggregateID;
   patientDiagnosticData: Omit<CreatePatientDiagnosticData, "sex" | "birthday">;
}
export class NutritionalDiagnosticFactory implements Factory<CreateNutritionalDiagnosticProps, NutritionalDiagnostic> {
   constructor(
      private readonly idGenerator: GenerateUniqueId,
      private readonly patientDataValidationService: IPatientDataValidationService,
      private readonly patientAcl: PatientACL,
   ) {}
   async create(props: CreateNutritionalDiagnosticProps): Promise<Result<NutritionalDiagnostic>> {
      try {
         const patientDiagnosticDataResult = await this.createAndValidatePatientData(props.patientId, props.patientDiagnosticData);
         const domainDate = DomainDate.create();
         const combinedRes = Result.combine([patientDiagnosticDataResult, domainDate]);
         if (combinedRes.isFailure)
            return handleDiagnosticCoreError(
               CORE_SERVICE_ERRORS.NUTRITIONAL_DIAGNOSTIC_FACTORY.CREATION_FAILED.path,
               formatError(combinedRes, NutritionalDiagnosticFactory.name),
            );
         const nutritionalDiagnosticId = this.idGenerator.generate().toString();
         const nutritionalDiagnostic = new NutritionalDiagnostic({
            id: nutritionalDiagnosticId,
            props: {
               patientId: props.patientId,
               patientData: patientDiagnosticDataResult.val,
               date: domainDate.val,
               notes: [],
               atInit: true,
               modificationHistories: [],
            },
         });
         return Result.ok(nutritionalDiagnostic);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
   private async createAndValidatePatientData(
      patientId: AggregateID,
      patientDiagnosticData: CreateNutritionalDiagnosticProps["patientDiagnosticData"],
   ): Promise<Result<PatientDiagnosticData>> {
      try {
         const patientInfoResult = await this.checkIfIsValidPatientIdAndGetInfo(patientId);
         if (patientInfoResult.isFailure) return Result.fail(formatError(patientInfoResult, NutritionalDiagnosticFactory.name));
         const patientInfo = patientInfoResult.val;
         const patientDiagnosticDataId = this.idGenerator.generate().toString();
         const patientDiagnosticDataResult = PatientDiagnosticData.create(
            { ...patientDiagnosticData, sex: patientInfo.gender.sex, birthday: patientInfo.birthday.toString() },
            patientDiagnosticDataId,
         );
         if (patientDiagnosticDataResult.isFailure) return patientDiagnosticDataResult;
         const patientValidationResult = await this.patientDataValidationService.validate(patientDiagnosticDataResult.val);
         if (patientValidationResult.isFailure) return Result.fail(formatError(patientValidationResult, NutritionalDiagnosticFactory.name));
         return patientDiagnosticDataResult;
      } catch (e: unknown) {
         return handleError(e);
      }
   }
   private async checkIfIsValidPatientIdAndGetInfo(patientId: AggregateID): Promise<Result<PatientInfo>> {
      try {
         const patientIds = await this.patientAcl.getAllPatientIds();
         if (!patientIds.includes(patientId))
            return handleDiagnosticCoreError(
               CORE_SERVICE_ERRORS.NUTRITIONAL_DIAGNOSTIC_FACTORY.PATIENT_NOT_FOUND.path,
               `Detail : ${patientId} AvailablePatient: ${patientIds.join(";")} .`,
            );
         const patientInfo = await this.patientAcl.getPatientInfo(patientId);
         return Result.ok(patientInfo);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
