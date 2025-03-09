import { ApplicationMapper, formatError, handleError, left, Result, right, UseCase, ValueType } from "@shared";
import { UpdatePatientDiagnosticDataRequest } from "./Request";
import { UpdatePatientDiagnosticDataResponse } from "./Response";
import {
   AnthropometricData,
   BiologicalTestResult,
   ClinicalData,
   IPatientDataValidationService,
   NutritionalDiagnostic,
   NutritionalDiagnosticRepository,
   PatientDiagnosticData,
} from "../../../../../domain";
import { PatientDiagnosticDataDto } from "../../../../dtos";

export class UpdatePatientDiagnosticDataUseCase implements UseCase<UpdatePatientDiagnosticDataRequest, UpdatePatientDiagnosticDataResponse> {
   constructor(
      private readonly nutritionalDiagnosticRepo: NutritionalDiagnosticRepository,
      private readonly patientValidationService: IPatientDataValidationService,
      private readonly mapper: ApplicationMapper<PatientDiagnosticData, PatientDiagnosticDataDto>,
   ) {}
   async execute(request: UpdatePatientDiagnosticDataRequest): Promise<UpdatePatientDiagnosticDataResponse> {
      try {
         const nutritionalDiagnostic = await this.nutritionalDiagnosticRepo.getById(request.nutritionalDiagnosticId);
         const updatedRes = this.updatePatientDiagnosticData(nutritionalDiagnostic, request.patientDiagnosticData);
         if (updatedRes.isFailure) return left(updatedRes);
         const validationResult = await this.validatePatientDiagnosticData(nutritionalDiagnostic);
         if (validationResult.isFailure) return left(validationResult);

         await this.nutritionalDiagnosticRepo.save(nutritionalDiagnostic);
         
         return right(Result.ok(this.mapper.toResponse(nutritionalDiagnostic.getPatientData())));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
   private updatePatientDiagnosticData(
      nutritionalDiagnostic: NutritionalDiagnostic,
      data: UpdatePatientDiagnosticDataRequest["patientDiagnosticData"],
   ): Result<ValueType> {
      try {
         if (data.clinicalData) {
            const clinicalData = ClinicalData.create(data.clinicalData);
            if (clinicalData.isFailure) return clinicalData;
            nutritionalDiagnostic.changeClinicalData(clinicalData.val);
         }
         if (data.anthropometricData) {
            const anthropometricData = AnthropometricData.create({ anthropometricMeasures: data.anthropometricData.data });
            if (anthropometricData.isFailure) return anthropometricData;
            nutritionalDiagnostic.changeAnthropometricData(anthropometricData.val);
         }
         if (data.biologicalTestResults) {
            const biologicalTestResults = data.biologicalTestResults.map(BiologicalTestResult.create);
            const combinedRes = Result.combine(biologicalTestResults);
            if (combinedRes.isFailure) return combinedRes;
            nutritionalDiagnostic.changeBiologicalTestResult(biologicalTestResults.map((res) => res.val));
         }
         return Result.ok();
      } catch (e: unknown) {
         return handleError(e);
      }
   }
   private async validatePatientDiagnosticData(nutritionalDiagnostic: NutritionalDiagnostic): Promise<Result<boolean>> {
      try {
         const { atInit, patientData } = nutritionalDiagnostic.getProps();
         if (!atInit) return Result.ok(true);
         const patientDataValidationResult = await this.patientValidationService.validate(patientData);
         if (patientDataValidationResult.isFailure)
            return Result.fail(formatError(patientDataValidationResult, UpdatePatientDiagnosticDataUseCase.name));
         return Result.ok(true);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
