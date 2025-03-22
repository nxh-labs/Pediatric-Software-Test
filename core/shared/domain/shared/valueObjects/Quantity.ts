import { Guard, Result } from "../../../core";
import { handleError, NegativeValueError } from "../../../exceptions";
import { ValueObject } from "../../common";
import { MeasureUnit } from "./MeasureUnit";

export interface IQuantity {
   value: number;
   unit: MeasureUnit;
}
export interface CreateQuantityProps {
   value: number;
   unit: string;
}
export class Quantity extends ValueObject<IQuantity> {
   get value(): number {
      return this.props.value;
   }
   get unit(): string {
      return this.props.unit.toString();
   }
   protected validate(props: Readonly<IQuantity>): void {
      if (Guard.isNegative(props.value).succeeded) throw new NegativeValueError("In nutrition , the quantity value must be a positive number.");
   }
   static create(createProps: CreateQuantityProps, availableUnits: MeasureUnit[]): Result<Quantity> {
      try {
         const measureUnitResult = MeasureUnit.create(createProps.unit);
         if (measureUnitResult.isFailure) return Result.fail(String(measureUnitResult.err));
         const findMeasureUnitIndex = availableUnits.findIndex((unit) => unit.equals(measureUnitResult.val));
         if (findMeasureUnitIndex == -1)
            return Result.fail<Quantity>(
               `The provided measure unit isn't valide.[NOTE]: Here are the supported measure unit (${availableUnits
                  .map((unit) => unit.toString())
                  .join(",")})`,
            );
         const quantity = new Quantity({
            value: createProps.value,
            unit: measureUnitResult.val,
         });
         return Result.ok(quantity);
      } catch (error) {
         return handleError(error);
      }
   }
}
