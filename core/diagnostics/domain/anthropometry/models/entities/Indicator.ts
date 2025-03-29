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
   SystemCode,
} from "@shared";
import { AvailableChart, CreateAvailableChart, IAvailableChart } from "../valueObjects";

/**
 * `Indicator`

|**Property** | **Type**  | **Desc** |
|-------------|--------------|------------------|
| `name`  | `String` | C'est le nom de l'indicateur de croissance  |
| `code` | `String` | C'est le code pour l'identifier dans le systeme |
| `neededMeasureCodes` | `String[]` | C'est un tableau de code qui corresponds au mesures necessaire pour utiliser cet indicateur associer a leur unite de mesure |
| `axeX`  | `String`  | C'est une formule sous forme de string qui va etre evaluer avec les mesures necessaire pour retourner la valeur de l'axe des X |
| `axeY`  | `String` | C'est la valeur pour l'axe Y (string pour retourner la valeur de l'axe Y aussi )|
 */
export interface IIndicator extends EntityPropsBaseType {
   code: SystemCode;
   name: string;
   neededMeasureCodes: SystemCode[];
   axeX: string;
   axeY: string;
   availableRefCharts: AvailableChart[];
}
export interface CreateIndicatorProps {
   code: string;
   name: string;
   neededMeasureCodes: string[];
   axeX: string;
   axeY: string;
   availableRefCharts: CreateAvailableChart[];
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
   getAxeY(): string {
      return this.props.axeY;
   }
   getAxeX(): string {
      return this.props.axeX;
   }
   getAvailableCharts(): IAvailableChart[] {
      return this.props.availableRefCharts.map((charts) => charts.unpack());
   }
   changeName(name: string) {
      this.props.name = name;
      this.validate();
   }
   changeNeededMeasureCodes(measureCodes: SystemCode[]) {
      this.props.neededMeasureCodes = measureCodes;
      this.validate();
   }
   changeAxe(axes: { axeX?: string; axeY?: string }) {
      if (axes.axeX) this.props.axeX = axes.axeX;
      if (axes.axeY) this.props.axeY = axes.axeY;
      this.validate();
   }
   changeAvailableCharts(availableCharts: AvailableChart[]) {
    this.props.availableRefCharts = availableCharts
    this.validate()
   }
   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("The name of Indicator can't be empty.");
      if (!isValidFormula(this.props.axeX)) throw new ArgumentInvalidException("The axeX formula in indicator is not valid.");
      if (!isValidFormula(this.props.axeY)) throw new ArgumentInvalidException("The axeY formula in indicator is not valid.");
      this._isValid = true;
   }

   static create(createIndicatorProps: CreateIndicatorProps, id: AggregateID): Result<Indicator> {
      try {
         const codeRes = SystemCode.create(createIndicatorProps.code);
         const neededMeasureCodesRes = createIndicatorProps.neededMeasureCodes.map(SystemCode.create);
         const availableRefChartsRes = createIndicatorProps.availableRefCharts.map(AvailableChart.create);
         const combineRes = Result.combine([codeRes, ...neededMeasureCodesRes, ...availableRefChartsRes]);
         if (combineRes.isFailure) return Result.fail(String(combineRes.err));
         return Result.ok(
            new Indicator({
               id,
               props: {
                  code: codeRes.val,
                  name: createIndicatorProps.name,
                  neededMeasureCodes: neededMeasureCodesRes.map((res) => res.val),
                  axeX: createIndicatorProps.axeX,
                  axeY: createIndicatorProps.axeY,
                  availableRefCharts: availableRefChartsRes.map((res) => res.val),
               },
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
