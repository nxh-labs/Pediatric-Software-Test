export enum GrowthStandard {
  OMS = "oms",
  NCHS = "nchs",
  CDC = "cdc",
}
/**
 * @enum StandardShape c'est la forme de standard de reference utilisée
 * @prop TABLE : pour les references interpretées par talbe
 * @prop CURVE: pour les reference interpretées par courbe
 */
export enum StandardShape {
  TABLE = "growth_table",
  CURVE = "growth_curve",
}

export enum GrowthIndicatorRange {
  ABOVE_4 = "above +4",
  ABOVE_3 = "above +3",
  ABOVE_2 = "above +2",
  ABOVE_1 = "above +1",
  MEDIAN = "0",
  BELOW_M1 = "below -1",
  BELOW_M2 = "below -2",
  BELOW_M3 = "below -3",
  BELOW_M4 = "below -4",
}

export const DAY_IN_MONTHS = 30.4375;
export const DAY_IN_YEARS = 365.25;
export const MONTH_IN_YEARS = 12;
export const MAX_AGE_IN_PEDIATRIC = 18;

export enum ClinicalDataType {
  INT="number",
  BOOL="boolean",
  STR='string',
  RANGE ='range'
}
