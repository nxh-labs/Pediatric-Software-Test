import { 
    PatientService, 
    PatientMapper,
    CreatePatientUseCase,
    GetPatientUseCase,
    UpdatePatientUseCase,
    DeletePatientUseCase 
} from "@core/patient";
import { PatientRepositoryImpl } from "./repository.web/PatientRepository";
import { PatientInfraMapper } from "./mappers/PatientMapper";
import { GenerateUUID, IndexedDBConnection } from "../common";

export class PatientContext {
    private readonly dbConnection: IndexedDBConnection;
    private readonly infraMapper: PatientInfraMapper;
    private readonly repository: PatientRepositoryImpl;
    private readonly applicationMapper: PatientMapper;

    // Use Cases
    private readonly createUseCase: CreatePatientUseCase;
    private readonly getUseCase: GetPatientUseCase;
    private readonly updateUseCase: UpdatePatientUseCase;
    private readonly deleteUseCase: DeletePatientUseCase;

    // Service
    private readonly service: PatientService;

    constructor(dbConnection: IndexedDBConnection) {
        // Infrastructure
        this.dbConnection = dbConnection;
        this.infraMapper = new PatientInfraMapper();
        this.repository = new PatientRepositoryImpl(this.dbConnection, this.infraMapper);

        // Application
        this.applicationMapper = new PatientMapper();

        // Use Cases
        this.createUseCase = new CreatePatientUseCase(new GenerateUUID(), this.repository);
        this.getUseCase = new GetPatientUseCase(this.repository, this.applicationMapper);
        this.updateUseCase = new UpdatePatientUseCase(this.repository);
        this.deleteUseCase = new DeletePatientUseCase(this.repository);

        // Service
        this.service = new PatientService({
            createUC: this.createUseCase,
            getUC: this.getUseCase,
            updateUC: this.updateUseCase,
            deleteUC: this.deleteUseCase
        });
    }

    getService(): PatientService {
        return this.service;
    }
}