import { ZScoreComputingData, ZScoreComputingStrategy } from "./interfaces/ZScoreComputingStrategy";

export class LenheiBasedStrategy implements ZScoreComputingStrategy {
    computeZScore(data: ZScoreComputingData): number {
        throw new Error("Method not implemented.");
    }
    
}