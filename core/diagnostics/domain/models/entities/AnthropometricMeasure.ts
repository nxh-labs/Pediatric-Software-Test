import {
   AggregateID,
   ArgumentInvalidException,
   EmptyStringError,
   Entity,
   EntityPropsBaseType,
   formatError,
   Guard,
   handleError,
   isValidCondition,
   Result,
   SystemCode,
   UnitCode,
} from "@shared";

export interface IAnthropometricMeasure extends EntityPropsBaseType {
   name: string;
   code: SystemCode;
   validationRules: string[];
   validationRuleVariables: string[];
   availableUnit: UnitCode[];
   unit: UnitCode;
}

export interface CreateAnthropometricMeasure {
   name: string;
   code: string;
   validationRules: string[];
   validationRuleVariables: string[];
   availableUnit: string[];
   unit: string;
}

export class AnthropometricMeasure extends Entity<IAnthropometricMeasure> {
   getName(): string {
      return this.props.name;
   }
   getCode(): string {
      return this.props.code.unpack();
   }
   getValidationRules(): { rules: string[]; variables: string[] } {
      return { rules: this.props.validationRules, variables: this.props.validationRuleVariables };
   }
   getUnits(): { defaultUnit: string; availableUnits: string[] } {
      return { defaultUnit: this.props.unit.unpack(), availableUnits: this.props.availableUnit.map((unit) => unit.unpack()) };
   }
   changeName(name: string) {
      this.props.name = name;
      this.validate();
   }
   changeUnits(units: { defaultUnit: UnitCode; availableUnits: UnitCode[] }) {
      this.props.unit = units.defaultUnit;
      this.props.availableUnit = units.availableUnits;
      this.validate();
   }
   changeValidationRules(validationRules: { rules: string[]; variables: string[] }) {
      this.props.validationRules = validationRules.rules;
      this.props.validationRuleVariables = validationRules.variables;
      this.validate();
   }
   
   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("The name of AnthropometricMeasure can't be empty.");
      if (this.props.validationRules.some((rule) => !isValidCondition(rule)))
         throw new ArgumentInvalidException("The provide rule must be valid. Please check a provided rule.");
      if (this.props.validationRuleVariables.some((variable) => Guard.isEmpty(variable).succeeded))
         throw new ArgumentInvalidException("The name of variable in AnthropometricMeasure can't be empty.");
      this._isValid = true;
   }

   static create(createProps: CreateAnthropometricMeasure, id: AggregateID): Result<AnthropometricMeasure> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         const unitRes = UnitCode.create(createProps.unit);
         const availableUnitsRes = createProps.availableUnit.map(UnitCode.create);
         const combinedRes = Result.combine([codeRes, unitRes, ...availableUnitsRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, AnthropometricMeasure.name));
         return Result.ok(
            new AnthropometricMeasure({
               id,
               props: {
                  code: codeRes.val,
                  name: createProps.name,
                  unit: unitRes.val,
                  validationRules: createProps.validationRules,
                  validationRuleVariables: createProps.validationRuleVariables,
                  availableUnit: availableUnitsRes.map((res) => res.val),
               },
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
