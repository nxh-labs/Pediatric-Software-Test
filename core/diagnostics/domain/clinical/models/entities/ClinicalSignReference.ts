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
} from "@shared";
import { ClinicalSignData, CreateClinicalSignData, IClinicalSignData } from "./../valueObjects";

export interface IClinicalSignReference extends EntityPropsBaseType {
   name: string;
   code: SystemCode;
   description: string;
   suspectedNutrients: SystemCode[];
   condition: string;
   conditionVariables: string[];
   data: ClinicalSignData[];
}

export interface CreateClinicalSignReference {
   name: string;
   code: string;
   description: string;
   suspectedNutrients: string[];
   condition: string;
   conditionVariables: string[];
   data: CreateClinicalSignData[];
}

export class ClinicalSignReference extends Entity<IClinicalSignReference> {
   getName(): string {
      return this.props.name;
   }
   getCode(): string {
      return this.props.code.unpack();
   }
   getDesc(): string {
      return this.props.description;
   }
   getSuspectedNutrients(): string[] {
      return this.props.suspectedNutrients.map((nut) => nut.unpack());
   }
   getCondition(): { condition: string; variables: string[] } {
      return { condition: this.props.condition, variables: this.props.conditionVariables };
   }
   getClinicalSignData(): IClinicalSignData[] {
      return this.props.data.map((signData) => signData.unpack());
   }
   changeName(name: string) {
      this.props.name = name;
      this.validate();
   }
   changeDesc(desc: string) {
      this.props.description = desc;
      this.validate();
   }
   changeSuspectedNutrients(suspectedNutrients: SystemCode[]) {
      this.props.suspectedNutrients = suspectedNutrients;
      this.validate();
   }
   changeCondition(condition: { condition: string; variables: string[] }) {
      this.props.condition = condition.condition;
      this.props.conditionVariables = condition.variables;
      this.validate();
   }
   changeClinicalSignData(data: ClinicalSignData[]) {
      this.props.data = data;
      this.validate();
   }
   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) {
         throw new EmptyStringError("The name of ClinicalSignReference can't be empty.");
      }
      if (Guard.isEmpty(this.props.description).succeeded) {
         throw new EmptyStringError("The description of ClinicalSignReference must be provide and can't be empty.");
      }
      if (!isValidCondition(this.props.condition)) {
         throw new ArgumentInvalidException(
            "The provided Condition for ClinicalSignReference must be a valid condition. Please change a condition format and retry.",
         );
      }
      if (this.props.conditionVariables.some((variable) => Guard.isEmpty(variable).succeeded)) {
         throw new EmptyStringError("The variable name can't be empty on ClinicalSignReference.");
      }

      this._isValid = true;
   }

   static create(createProps: CreateClinicalSignReference, id: AggregateID): Result<ClinicalSignReference> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         const suspectedNutrientsRes = createProps.suspectedNutrients.map(SystemCode.create);
         const clinicalSignDataRes = createProps.data.map(ClinicalSignData.create);
         const combinedRes = Result.combine([codeRes, ...suspectedNutrientsRes, ...clinicalSignDataRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, ClinicalSignReference.name));
         return Result.ok(
            new ClinicalSignReference({
               id,
               props: {
                  code: codeRes.val,
                  name: createProps.name,
                  description: createProps.description,
                  conditionVariables: createProps.conditionVariables,
                  condition: createProps.condition,
                  suspectedNutrients: suspectedNutrientsRes.map((res) => res.val),
                  data: clinicalSignDataRes.map((res) => res.val),
               },
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
