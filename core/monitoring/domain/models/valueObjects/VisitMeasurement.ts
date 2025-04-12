import {
   ArgumentNotProvidedException,
   formatError,
   Guard,
   handleError,
   Result,
   SystemCode,
   UnitCode,
   ValueObject,
} from "@shared";

export interface MeasureEntry {
   code: SystemCode;
   value: number;
   unit: UnitCode;
}

export interface IVisitMeasurement {
   anthropometricMeasures: MeasureEntry[];
   clinicalData: {
      edema: {
         code: SystemCode;
         data: { type: "Bilateral" | "Unilateral"; godetStep: 0 | 1 | 2 | 3 };
      };
      otherSigns: { code: SystemCode; data: unknown }[];
   };
   biologicalResults: MeasureEntry[];
}
export interface CreateVisitMeasurementProps {
   anthropometricMeasures: { code: string; value: number; unit: string }[];
   clinicalData: {
      edema: {
         code: string;
         data: { type: "Bilateral" | "Unilateral"; godetStep: 0 | 1 | 2 | 3 };
      };
      otherSigns: { code: string; data: unknown }[];
   };
   biologicalResults: { code: string; value: number; unit: string }[];
}

export class VisitMeasurement extends ValueObject<IVisitMeasurement> {
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   protected validate(props: Readonly<IVisitMeasurement>): void {
      // Validation code here
      if (Guard.isEmpty(props.anthropometricMeasures).succeeded)
         throw new ArgumentNotProvidedException("The anthropometricMeasure must be provide. Please provide a weight.");
   }
   static createMeasureEntry(entryData: { code: string; value: number; unit: string }): Result<MeasureEntry> {
      try {
         const codeRes = SystemCode.create(entryData.code);
         const unitRes = UnitCode.create(entryData.unit);
         const combinedRes = Result.combine([codeRes, unitRes]);
         if (combinedRes.isFailure) return combinedRes as Result<MeasureEntry>;
         return Result.ok({
            code: codeRes.val,
            unit: unitRes.val,
            value: entryData.value,
         });
      } catch (e: unknown) {
         return handleError(e);
      }
   }
   static createClinicalData<T>(data: { code: string; data: T }): Result<{ code: SystemCode; data: T }> {
      try {
         const codeRes = SystemCode.create(data.code);
         if (codeRes.isFailure) return Result.fail(formatError(codeRes));
         return Result.ok({ code: codeRes.val, data: data.data });
      } catch (e: unknown) {
         return handleError(e);
      }
   }

   static create(createProps: CreateVisitMeasurementProps): Result<VisitMeasurement> {
      try {
         const anthropometricMeasureRes = createProps.anthropometricMeasures.map(this.createMeasureEntry);
         const biologicalResults = createProps.biologicalResults.map(this.createMeasureEntry);
         const edemaRes = this.createClinicalData(createProps.clinicalData.edema);
         const otherSignsRes = createProps.clinicalData.otherSigns.map(this.createClinicalData);
         const combinedRes = Result.combine([edemaRes, ...otherSignsRes, ...anthropometricMeasureRes, ...biologicalResults]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, VisitMeasurement.name));
         return Result.ok(
            new VisitMeasurement({
               anthropometricMeasures: anthropometricMeasureRes.map((res) => res.val),
               biologicalResults: biologicalResults.map((res) => res.val),
               clinicalData: {
                  edema: edemaRes.val,
                  otherSigns: otherSignsRes.map((res) => res.val),
               },
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
