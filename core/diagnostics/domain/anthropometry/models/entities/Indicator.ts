import {
   AggregateID,
   ArgumentOutOfRangeException,
   EmptyStringError,
   Entity,
   EntityPropsBaseType,
   Guard,
   handleError,
   Result,
   SystemCode,
} from "@shared";
import {
   AvailableChart,
   CreateAvailableChart,
   CreateIndicatorInterpreter,
   IAvailableChart,
   IIndicatorInterpreter,
   IndicatorInterpreter,
} from "../valueObjects";
import { Condition, Formula, ICondition, IFormula } from "../../../common";
import { GrowthIndicatorRange } from "../constants";

/**
 * `Indicator`

|**Property** | **Type**  | **Desc** |
|-------------|--------------|------------------|
| `name`  | `String` | C'est le nom de l'indicateur de croissance  |
| `code` | `String` | C'est le code pour l'identifier dans le systeme |
| `neededMeasureCodes` | `String[]` | C'est un tableau de code qui corresponds au mesures necessaire pour utiliser cet indicateur associer a leur unite de mesure |
| `axeX`  | `Formula`  | C'est une formule sous forme de string qui va etre evaluer avec les mesures necessaire pour retourner la valeur de l'axe des X |
| `axeY`  | `Formula` | C'est la valeur pour l'axe Y (string pour retourner la valeur de l'axe Y aussi )|
 */
export interface IIndicator extends EntityPropsBaseType {
   code: SystemCode;
   name: string;
   neededMeasureCodes: SystemCode[];
   axeX: Formula;
   axeY: Formula;
   availableRefCharts: AvailableChart[];
   usageConditions: Condition; // Ici puisque l'utilisation de l'indicateur peut aussi dependre du tranche d'age
   interpretations: IndicatorInterpreter[];
}
export interface CreateIndicatorProps {
   code: string;
   name: string;
   neededMeasureCodes: string[];
   axeX: IFormula;
   axeY: IFormula;
   availableRefCharts: CreateAvailableChart[];
   usageCondition: ICondition;
   interpretations: CreateIndicatorInterpreter[];
}
export class Indicator extends Entity<IIndicator> {
   getName(): string {
      return this.props.name;
   }
   getCode(): string {
      return this.props.code.unpack();
   }
   getMeasureCodes(): string[] {
      return this.props.neededMeasureCodes.map((code) => code.unpack());
   }
   getAxeY(): IFormula {
      return this.props.axeY.unpack();
   }
   getAxeX(): IFormula {
      return this.props.axeX.unpack();
   }
   getAvailableCharts(): IAvailableChart[] {
      return this.props.availableRefCharts.map((charts) => charts.unpack());
   }
   getUsageCondition(): ICondition {
      return this.props.usageConditions.unpack();
   }
   getInterpretations(): IIndicatorInterpreter[] {
      return this.props.interpretations.map((indicatorInterpretation) => indicatorInterpretation.unpack());
   }
   changeName(name: string) {
      this.props.name = name;
      this.validate();
   }
   changeNeededMeasureCodes(measureCodes: SystemCode[]) {
      this.props.neededMeasureCodes = measureCodes;
      this.validate();
   }
   changeAxe(axes: { axeX?: Formula; axeY?: Formula }) {
      if (axes.axeX) this.props.axeX = axes.axeX;
      if (axes.axeY) this.props.axeY = axes.axeY;
      this.validate();
   }
   changeAvailableCharts(availableCharts: AvailableChart[]) {
      this.props.availableRefCharts = availableCharts;
      this.validate();
   }
   changeUsageCondition(condition: Condition) {
      this.props.usageConditions = condition;
      this.validate();
   }
   changeInterpretations(interpretations: IndicatorInterpreter[]) {
      this.props.interpretations = interpretations;
      this.validate();
   }
   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("The name of Indicator can't be empty.");
      if (Object.values(GrowthIndicatorRange).length < this.props.interpretations.length)
         throw new ArgumentOutOfRangeException("La liste des interpretations possibles ne peut depasser les ranges de valeurs possibles.");
      this.validateIfInterpretationRangeIsUnique();
      this._isValid = true;
   }
   private validateIfInterpretationRangeIsUnique() {
      const interpretationRange = new Set();
      for (const interpretation of this.props.interpretations) {
         const range = interpretation.unpack().range;
         if (interpretationRange.has(range)) {
            throw new ArgumentOutOfRangeException("On ne peut avoir qu'une seule interpretation pour un range.");
         } else {
            interpretationRange.add(range);
         }
      }
   }
   static create(createIndicatorProps: CreateIndicatorProps, id: AggregateID): Result<Indicator> {
      try {
         const codeRes = SystemCode.create(createIndicatorProps.code);
         const neededMeasureCodesRes = createIndicatorProps.neededMeasureCodes.map(SystemCode.create);
         const availableRefChartsRes = createIndicatorProps.availableRefCharts.map(AvailableChart.create);
         const axeXFormulaRes = Formula.create(createIndicatorProps.axeX);
         const axeYFormulaRes = Formula.create(createIndicatorProps.axeY);
         const conditionRes = Condition.create(createIndicatorProps.usageCondition);
         const interpretationsRes = createIndicatorProps.interpretations.map(IndicatorInterpreter.create);
         const combineRes = Result.combine([
            codeRes,
            axeXFormulaRes,
            axeYFormulaRes,
            conditionRes,
            ...neededMeasureCodesRes,
            ...availableRefChartsRes,
            ...interpretationsRes,
         ]);
         if (combineRes.isFailure) return Result.fail(String(combineRes.err));
         return Result.ok(
            new Indicator({
               id,
               props: {
                  code: codeRes.val,
                  name: createIndicatorProps.name,
                  neededMeasureCodes: neededMeasureCodesRes.map((res) => res.val),
                  axeX: axeXFormulaRes.val,
                  axeY: axeYFormulaRes.val,
                  availableRefCharts: availableRefChartsRes.map((res) => res.val),
                  usageConditions: conditionRes.val,
                  interpretations: interpretationsRes.map((res) => res.val),
               },
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
