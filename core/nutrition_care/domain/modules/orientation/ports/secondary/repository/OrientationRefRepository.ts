import { Repository, SystemCode } from "@shared";
import { OrientationReference } from "../../../models";

export interface OrientationReferenceRepository extends Repository<OrientationReference> {
   getAll(): Promise<OrientationReference[]>;
   getByCode(code: SystemCode) : Promise<OrientationReference>
}
