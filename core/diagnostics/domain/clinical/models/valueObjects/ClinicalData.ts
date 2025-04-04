/**
 * @fileoverview Value object representing clinical observation data for a patient.
 * 
 * Key components:
 * @interface EdemaData - Structure for edema-specific observations
 * - type: Classification of edema (Bilateral/Unilateral)
 * - godetStep: Severity measure (0-3)
 * 
 * @interface IClinicalData - Complete clinical data structure
 * - edema: Required edema assessment
 * - otherSigns: Additional clinical observations
 */

import { ArgumentNotProvidedException, Guard, handleError, Result, ValueObject } from "@shared";
import { ClinicalSign } from "./ClinicalSign";

export interface EdemaData {
   type: "Bilateral" | "Unilateral";
   godetStep: 0 | 1 | 2 | 3;
}
export interface IClinicalData {
   edema: ClinicalSign<EdemaData>;
   otherSigns: ClinicalSign<object>[];
}

export class ClinicalData extends ValueObject<IClinicalData> {
   protected validate(props: Readonly<IClinicalData>): void {
      if (Guard.isEmpty(props.edema).succeeded) {
         throw new ArgumentNotProvidedException("The edema must be provide");
      }
   }
   static create(props: IClinicalData): Result<ClinicalData> {
      try {
         return Result.ok(new ClinicalData(props));
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
