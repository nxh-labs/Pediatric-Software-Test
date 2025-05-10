import { AggregateID } from "@shared";
import { CreateVisitMeasurementProps } from "../../domain";

export interface VisitDto {
    id: AggregateID
    date: string 
    observerId: AggregateID
    visitPurpose: string 
    notes:string []
    measurement: CreateVisitMeasurementProps
    createdAt: string 
    updatedAt: string 
}