import { ArgumentInvalidException, Guard, handleError, Result, Sex, ValueObject } from "@shared";

/**
 * @interface ITableData
 * @property {number} value - C'est la valeur sur la ligne
 * @property {number} median - C'est la valeur médiane pour le bon état nutritionnel correspondant a 100% pour NCHS et 0 pour l'OMS
 * @property {number} moderate - C'est la valeur pour la MA Modere correspondant a 80% pour NCHS et -2 pour l'OMS
 * @property {number} severe = C'est la valeur pour la MA Severe correspondant a 70% pour NCHS et - 3 pour OMS
 */
export interface ITableData {
   value: number;
   median: number;
   moderate: number;
   severe: number;
   isUnisex: boolean 
   sex: Sex
}

export class TableData extends ValueObject<ITableData> {
   protected validate(props: Readonly<ITableData>): void {
      const isNumbers = [
         !Guard.isNumber(props.value).succeeded,
         !Guard.isNumber(props.median).succeeded,
         !Guard.isNumber(props.moderate).succeeded,
         !Guard.isNumber(props.severe).succeeded,
      ];
      if (isNumbers.some(Boolean)) {
         throw new ArgumentInvalidException("The value|median|moderate|severe of growth ref table data must be number.");
      }
      // TODO: Implementer la logique pour valider que ce n'est pas un nomber négative
   }
   static create(props: ITableData): Result<TableData> {
      try {
         return Result.ok(new TableData(props));
      } catch (e) {
         return handleError(e);
      }
   }
}
