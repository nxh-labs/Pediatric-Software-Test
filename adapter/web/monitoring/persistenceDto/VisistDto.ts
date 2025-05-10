import { EntityPersistenceDto } from "../../common";

export interface MeasureEntryDto {
    code: string 
    value: number 
    unit: string 
}
export interface VisitPersistenceDto  extends EntityPersistenceDto {
    date: string 
    visitPurpose: string 
    notes: string []
    measurement: {
        anthroMeasures: MeasureEntryDto[]
    }
}