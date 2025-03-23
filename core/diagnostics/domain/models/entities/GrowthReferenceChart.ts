import {
   AggregateID,
   ArgumentInvalidException,
   EmptyStringError,
   Entity,
   EntityPropsBaseType,
   Guard,
   handleError,
   isValidFormula,
   Result,
   Sex,
   SystemCode,
   UnitCode,
} from "@shared";
import { ChartData, ChartInterpreter, CreateChartInterpreter, IChartData, IChartInterpreter } from "../valueObjects";

export interface IGrowthReferenceChart extends EntityPropsBaseType {
   code: SystemCode;
   name: string;
   sex: Sex;
   unitCode: UnitCode;
   valueFormula: string;
   formulaVariable: string[];
   data: ChartData[];
   chartInterpreters: ChartInterpreter[];
}
export interface CreateGrowthReferenceChartProps {
   code: string;
   name: string;
   sex: "M" | "F";
   unitCode: string;
   valueFormula: string;
   formulaVariable: string[];
   data: IChartData[];
   chartInterpreters: CreateChartInterpreter[];
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
   getFormula(): { formula: string; formulaVariable: string[] } {
      return {
         formula: this.props.valueFormula,
         formulaVariable: this.props.formulaVariable,
      };
   }
   getChartData(): IChartData[] {
      return this.props.data.map((chartData) => chartData.unpack());
   }
   getInterpreter(): IChartInterpreter[] {
      return this.props.chartInterpreters.map((chartInterpreter) => chartInterpreter.unpack());
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
   changeFormula(formula: { formula: string; formulaVariables: string[] }) {
      this.props.valueFormula = formula.formula;
      this.props.formulaVariable = formula.formulaVariables;
      this.validate();
   }
   changeData(chartData: ChartData[]) {
      this.props.data = chartData;
      this.validate();
   }
   changeInterpreter(chartInterpreters: ChartInterpreter[]) {
      this.props.chartInterpreters = chartInterpreters;
      this.validate();
   }

   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("The name of GrowthReferenceChart can't be empty.");
      if (!isValidFormula(this.props.valueFormula))
         throw new ArgumentInvalidException("The valueFormula is not valid. Please provide a valid formula for the GrowthReferenceChart");
      if (this.props.formulaVariable.some((variable) => Guard.isEmpty(variable).succeeded))
         throw new EmptyStringError("The formula Variable name can't be empty.");
      this._isValid = true;
   }

   static create(createProps: CreateGrowthReferenceChartProps, id: AggregateID): Result<GrowthReferenceChart> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         const unitCodeRes = UnitCode.create(createProps.unitCode);
         const chartDataRes = createProps.data.map((chartData) => ChartData.create(chartData));
         const chartInterpreterRes = createProps.chartInterpreters.map((chartInterpreter) => ChartInterpreter.create(chartInterpreter));
         const combinedRes = Result.combine([codeRes, unitCodeRes, ...chartDataRes, ...chartInterpreterRes]);
         if (combinedRes.isFailure) return Result.fail(String(combinedRes.err));

         const growthReferenceChart = new GrowthReferenceChart({
            id,
            props: {
               name: createProps.name,
               code: codeRes.val,
               unitCode: unitCodeRes.val,
               formulaVariable: createProps.formulaVariable,
               valueFormula: createProps.valueFormula,
               sex: createProps.sex as Sex,
               chartInterpreters: chartInterpreterRes.map((valRes) => valRes.val),
               data: chartDataRes.map((chartData) => chartData.val),
            },
         });
         return Result.ok(growthReferenceChart);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
