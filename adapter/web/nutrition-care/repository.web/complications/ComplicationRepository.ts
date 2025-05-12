
import { Complication, ComplicationRepository } from "@core/nutrition_care";
import { EntityBaseRepository } from "../../../common";
import { ComplicationPersistenceDto } from "../../mappers";


export class ComplicationRepositoryImpl 
    extends EntityBaseRepository<Complication, ComplicationPersistenceDto> 
    implements ComplicationRepository {
    
    protected storeName = "complications";

}