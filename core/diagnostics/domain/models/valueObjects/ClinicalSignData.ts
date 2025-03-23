import { ArgumentNotProvidedException, EmptyStringError, formatError, Guard, handleError, Result, SystemCode, ValueObject } from "@shared";
import { ClinicalDataType } from "../../constants";

export interface IClinicalSignData {
   name: string;
   code: SystemCode;
   question: string;
   dataType: ClinicalDataType;
   dataRange?: [number, number];
}

export interface CreateClinicalSignData {
   name: string;
   code: string;
   question: string;
   dataType: ClinicalDataType;
   dataRange?: [number, number];
}

export class ClinicalSignData extends ValueObject<IClinicalSignData> {
   protected validate(props: Readonly<IClinicalSignData>): void {
      if (Guard.isEmpty(props.name).succeeded) throw new EmptyStringError("The name of ClinicalSignData can't be empty.");
      if (Guard.isEmpty(props.question).succeeded) throw new EmptyStringError("The question linked to ClinicalSignData can't be empty.");
      if (props.dataType == ClinicalDataType.RANGE && !props.dataRange) {
         throw new ArgumentNotProvidedException(
            "When data type of ClinicalSignData is Range, the dataRange must be provided. Please provide dataRange and retry.",
         );
      }
   }
   static create(createProps: CreateClinicalSignData): Result<ClinicalSignData> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         if (codeRes.isFailure) return Result.fail(formatError(codeRes, ClinicalSignData.name));
         return Result.ok(
            new ClinicalSignData({
               code: codeRes.val,
               name: createProps.name,
               question: createProps.question,
               dataType: createProps.dataType,
               dataRange: createProps.dataRange,
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
