import { Repository, SystemCode } from "@shared";
import { AppetiteTestRef } from "../../../models";

export interface AppetiteTestRefRepository extends Repository<AppetiteTestRef> {
   getByCode(code: SystemCode): Promise<AppetiteTestRef>;
}
