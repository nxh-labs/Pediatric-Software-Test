import { PatientService, PatientMapper, CreatePatientUseCase, GetPatientUseCase, UpdatePatientUseCase, DeletePatientUseCase } from "@core/patient";
import { PatientRepositoryImpl } from "./repository.web/PatientRepository";
import { PatientInfraMapper } from "./mappers/PatientMapper";
import { GenerateUUID, IndexedDBConnection } from "../common";
import { IEventBus } from "@shared";

export class PatientContext {
   private static instance: PatientContext | null = null;
   private readonly dbConnection: IndexedDBConnection;
   private readonly eventBus: IEventBus;
   private readonly infraMapper: PatientInfraMapper;
   private readonly repository: PatientRepositoryImpl;
   private readonly applicationMapper: PatientMapper;

   // Use Cases
   private readonly createUseCase: CreatePatientUseCase;
   private readonly getUseCase: GetPatientUseCase;
   private readonly updateUseCase: UpdatePatientUseCase;
   private readonly deleteUseCase: DeletePatientUseCase;

   // Service
   private readonly patientService: PatientService;

   private constructor(dbConnection: IndexedDBConnection,eventBus: IEventBus) {
      // Infrastructure
      this.dbConnection = dbConnection;
      this.eventBus =eventBus
      this.infraMapper = new PatientInfraMapper();
      this.repository = new PatientRepositoryImpl(this.dbConnection, this.infraMapper,this.eventBus);

      // Application
      this.applicationMapper = new PatientMapper();

      // Use Cases
      this.createUseCase = new CreatePatientUseCase(new GenerateUUID(), this.repository);
      this.getUseCase = new GetPatientUseCase(this.repository, this.applicationMapper);
      this.updateUseCase = new UpdatePatientUseCase(this.repository);
      this.deleteUseCase = new DeletePatientUseCase(this.repository);

      // Service
      this.patientService = new PatientService({
         createUC: this.createUseCase,
         getUC: this.getUseCase,
         updateUC: this.updateUseCase,
         deleteUC: this.deleteUseCase,
      });
   }
   static init(dbConnection: IndexedDBConnection,eventBus: IEventBus) {
      if (!PatientContext.instance) {
         this.instance = new PatientContext(dbConnection,eventBus);
      }
      return PatientContext.instance as PatientContext;
   }
   getService(): PatientService {
      return this.patientService;
   }
}
