/**
 * @fileoverview Service responsible for validating clinical data against defined standards.
 * 
 * @class ClinicalValidationService
 * @implements IClinicalValidationService
 * 
 * Key responsibilities:
 * - Validates completeness of clinical observations
 * - Ensures all required data points are present
 * - Verifies data format and ranges
 * - Cross-references with clinical sign definitions
 */

import { formatError, handleError, Result } from "@shared";
import { ValidateResult } from "../../common";
import { ClinicalData, ClinicalSign, ClinicalSignReference } from "../models";
import { ClinicalSignReferenceRepository, IClinicalValidationService } from "../ports";
import { CLINICAL_ERRORS, handleClinicalError } from "../errors";

export class ClinicalValidationService implements IClinicalValidationService {
   constructor(private readonly clinicalSignRepo: ClinicalSignReferenceRepository) {}

   async validate(clinicalData: ClinicalData): Promise<Result<ValidateResult>> {
      try {
         const signs = this.extractClinicalSigns(clinicalData);
         const validationResult = await this.validateSignsData(signs);
         if (validationResult.isFailure) {
            return handleClinicalError(
               CLINICAL_ERRORS.VALIDATION.INVALID_DATA.path,
               formatError(validationResult, ClinicalValidationService.name),
            ) as Result<ValidateResult>;
         }
         return Result.ok({ isValid: true });
      } catch (e: unknown) {
         return handleError(e);
      }
   }

   private extractClinicalSigns(data: ClinicalData): ClinicalSign<any>[] {
      return [data.unpack().edema, ...data.unpack().otherSigns];
   }

   private async validateSignsData(signs: ClinicalSign<any>[]): Promise<Result<void>> {
      try {
         const references = await this.getClinicalReferences(signs);
         return this.validateRequiredData(signs, references);
      } catch (error) {
         return handleClinicalError(CLINICAL_ERRORS.REPOSITORY.REFERENCE_NOT_FOUND.path, "Failed to fetch clinical references") as Result<void>;
      }
   }

   private async getClinicalReferences(signs: ClinicalSign<any>[]): Promise<ClinicalSignReference[]> {
      return Promise.all(signs.map((sign) => this.clinicalSignRepo.getByCode(sign.unpack().code)));
   }

   private validateRequiredData(signs: ClinicalSign<any>[], references: ClinicalSignReference[]): Result<void> {
      for (const clinicalRef of references) {
         const clinicalSignData = signs.find((sign) => sign.unpack().code.equals(clinicalRef.getProps().code));

         if (!clinicalSignData) {
            return handleClinicalError(
               CLINICAL_ERRORS.VALIDATION.MISSING_DATA.path,
               `Missing clinical sign data for ${clinicalRef.getCode()}`,
            ) as Result<void>;
         }

         const clinicalRefNeedDataCode = clinicalRef.getClinicalSignData().map((data) => data.code.unpack());
         const clinicalDataProvided = Object.keys(clinicalSignData.unpack().data);

         if (!clinicalRefNeedDataCode.every((code) => clinicalDataProvided.includes(code))) {
            return handleClinicalError(
               CLINICAL_ERRORS.VALIDATION.MISSING_DATA.path,
               `Incomplete clinical data for ${clinicalRef.getCode()}`,
            ) as Result<void>;
         }
      }
      return Result.ok();
   }
}
