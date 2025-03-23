import { EntityPropsBaseType, SystemCode, UnitCode } from "@shared";

/**
 * Cette entitie en vrai a besoins d'un ajustement puisque les donnes biochimique on des plages differentes pour l'age et le sex donc je dois creer une condition dans un value object et cette value object 
 * poura contenir la conditon , la plage , et les bornes de la pages doivent etre marquer pour bien differencier le plus/moin unique . 
 */
export interface IBiochemicalReference extends EntityPropsBaseType {
   name: string;
   code: SystemCode;
   unit: UnitCode;
   availableUnits: UnitCode[];

}
