import { Guard, handleError, NegativeValueError, Result, ValueObject } from "@shared";
/**
 * @interface IAnthropometricData contain all patient anthropometric data
 * @property weight - The weight in kg
 * @property height - The height in cm
 * @property length - The length in cm also
 * @property armCircumference - The ArmCircumference in cm
 * @property headCircumference - The headCircumference in cm
 */
export interface IAnthropometricData {
   weight?: number;
   height?: number;
   length?: number;
   armCircumference?: number;
   headCircumference?: number;
}

export class AnthropometricData extends ValueObject<IAnthropometricData> {
   protected validate(props: Readonly<IAnthropometricData>): void {
      if (props.weight && Guard.isNegative(props.weight).succeeded) {
         throw new NegativeValueError("The patient height must be empty value.");
      }
      if ((props.height && Guard.isNegative(props.height).succeeded) || (props.length && Guard.isNegative(props.length).succeeded)) {
         throw new NegativeValueError("The patient height or length must be negative.");
      }
      if (
         (props.armCircumference && Guard.isNegative(props.armCircumference).succeeded) ||
         (props.headCircumference && Guard.isNegative(props.headCircumference).succeeded)
      ) {
         throw new NegativeValueError("The armCircumference or headCircumference must be negative value.");
      }
   }
   static create(props: IAnthropometricData): Result<AnthropometricData> {
      try {
         return Result.ok(new AnthropometricData(props));
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
