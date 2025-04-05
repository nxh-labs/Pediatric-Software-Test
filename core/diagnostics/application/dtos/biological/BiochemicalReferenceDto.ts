import { BiochemicalRangeDto } from "./BiochemicalRangeDto";

export interface BiochemicalReferenceDto {
   id: string;
   name: string;
   code: string;
   unit: string;
   availableUnits: string[];
   ranges: BiochemicalRangeDto[];
   source: string;
   notes: string[];
   createdAt: string;
   updatedAt: string;
}
