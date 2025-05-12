import { UnitService, UnitMapper, CreateUnitUseCase, GetUnitUseCase, UpdateUnitUseCase, DeleteUnitUseCase, ConvertUnitUseCase } from "@core/units";
import { UnitRepositoryImpl } from "./repository.web/UnitRepository";
import { UnitInfraMapper } from "./mappers/UnitMapper";
import { GenerateUUID, IndexedDBConnection } from "../common";
import { UnitConverterService } from "@core/units/domain/services/UnitConverterService";


export class UnitContext {
    private readonly dbConnection: IndexedDBConnection;
    private readonly infraMapper: UnitInfraMapper;
    private readonly repository: UnitRepositoryImpl;
    private readonly applicationMapper: UnitMapper;
    private readonly converterService: UnitConverterService;

    // Use Cases
    private readonly createUseCase: CreateUnitUseCase;
    private readonly getUseCase: GetUnitUseCase;
    private readonly updateUseCase: UpdateUnitUseCase;
    private readonly deleteUseCase: DeleteUnitUseCase;
    private readonly convertUseCase: ConvertUnitUseCase;

    // Service
    private readonly service: UnitService;

    constructor(dbConnection: IndexedDBConnection) {
        // Infrastructure
        this.dbConnection = dbConnection;
        this.infraMapper = new UnitInfraMapper();
        this.repository = new UnitRepositoryImpl(this.dbConnection, this.infraMapper);

        // Application
        this.applicationMapper = new UnitMapper();
        this.converterService = new UnitConverterService();

        // Use Cases
        this.createUseCase = new CreateUnitUseCase(new GenerateUUID(), this.repository);
        this.getUseCase = new GetUnitUseCase(this.repository, this.applicationMapper);
        this.updateUseCase = new UpdateUnitUseCase(this.repository);
        this.deleteUseCase = new DeleteUnitUseCase(this.repository);
        this.convertUseCase = new ConvertUnitUseCase(this.repository, this.converterService);

        // Service
        this.service = new UnitService({
            createUC: this.createUseCase,
            getUC: this.getUseCase,
            updateUC: this.updateUseCase,
            deleteUC: this.deleteUseCase,
            convertUC: this.convertUseCase
        });
    }

    getService(): UnitService {
        return this.service;
    }
}