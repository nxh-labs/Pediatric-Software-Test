import { IAnthroComputingHelper } from "./interfaces/AnthroComputingHelper";
import { ZScoreComputingData, ZScoreComputingStrategy } from "./interfaces/ZScoreComputingStrategy";

export class AgeBasedStrategy implements ZScoreComputingStrategy {
    constructor(private anthroComputingHelper:IAnthroComputingHelper){}
    computeZScore(data: ZScoreComputingData): number {
        const {measurements,growthReferenceChart} = data
        
    }
    
}