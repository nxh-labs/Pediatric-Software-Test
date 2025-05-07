import { Repository } from "@shared";
import { OrientationReference } from "../../../models";

export interface OrientationReferenceRepository extends Repository<OrientationReference> {
   getAll(): Promise<OrientationReference[]>;
}
