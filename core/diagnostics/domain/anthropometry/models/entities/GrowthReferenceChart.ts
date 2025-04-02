import {
   AggregateID,
   EmptyStringError,
   Entity,
   EntityPropsBaseType,
   formatError,
   Guard,
   handleError,
   Result,
   Sex,
   SystemCode,
   UnitCode,
} from "@shared";
import { ChartData, IChartData } from "./../valueObjects";
import { Formula, IFormula } from "../../../common";

export interface IGrowthReferenceChart extends EntityPropsBaseType {
   code: SystemCode;
   name: string;
   sex: Sex;
   unitCode: UnitCode;
   formula: Formula;
   data: ChartData[];
}
export interface CreateGrowthReferenceChartProps {
   code: string;
   name: string;
   sex: "M" | "F";
   unitCode: string;
   formula: IFormula; // Cette propriete n'a plus sa place ici 
   data: IChartData[];
}
export class GrowthReferenceChart extends Entity<IGrowthReferenceChart> {
   getCode(): string {
      return this.props.code.unpack();
   }
   getName(): string {
      return this.props.name;
   }
   getSex(): Sex {
      return this.props.sex;
   }
   getUnitCode(): string {
      return this.props.unitCode.unpack();
   }
   getFormula(): IFormula {
      return this.props.formula.unpack();
   }
   getChartData(): IChartData[] {
      return this.props.data.map((chartData) => chartData.unpack());
   }

   changeName(name: string) {
      this.props.name = name;
      this.validate();
   }
   changeSex(sex: Sex) {
      this.props.sex = sex;
      this.validate();
   }
   changeUnitCode(unitCode: UnitCode) {
      this.props.unitCode = unitCode;
      this.validate();
   }
   changeFormula(formula: Formula) {
      this.props.formula = formula;
      this.validate();
   }
   changeData(chartData: ChartData[]) {
      this.props.data = chartData;
      this.validate();
   }

   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("The name of GrowthReferenceChart can't be empty.");
      this._isValid = true;
   }

   static create(createProps: CreateGrowthReferenceChartProps, id: AggregateID): Result<GrowthReferenceChart> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         const unitCodeRes = UnitCode.create(createProps.unitCode);
         const chartDataRes = createProps.data.map((chartData) => ChartData.create(chartData));
         const formulaRes = Formula.create(createProps.formula);
         const combinedRes = Result.combine([codeRes, unitCodeRes, formulaRes, ...chartDataRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, GrowthReferenceChart.name));

         const growthReferenceChart = new GrowthReferenceChart({
            id,
            props: {
               name: createProps.name,
               code: codeRes.val,
               unitCode: unitCodeRes.val,
               formula: formulaRes.val,
               sex: createProps.sex as Sex,
               data: chartDataRes.map((chartData) => chartData.val),
            },
         });
         return Result.ok(growthReferenceChart);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
