import { Result, SystemCode } from "@shared";
import { MedicineDosageResult } from "../../models";
import { AnthroSystemCodes } from "../../../../../../constants";

export interface IMedicineDosageService {
   generateDosage(medicineCode: SystemCode, context: { [AnthroSystemCodes.WEIGHT]: number }): Promise<Result<MedicineDosageResult>>;
}
