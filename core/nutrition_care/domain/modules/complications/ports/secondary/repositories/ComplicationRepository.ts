import { Repository } from "@shared";
import { Complication } from "../../../models";

export interface ComplicationRepository extends Repository<Complication> {
   getAll(): Promise<Complication[]>;
}
