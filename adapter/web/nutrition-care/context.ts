import { Factory, GenerateUniqueId, IEventBus, InfrastructureMapper, UseCase } from "@shared";
import { GenerateUUID, IndexedDBConnection } from "../common";
import {
   AddDataToPatientCareSessionRequest,
   AddDataToPatientCareSessionResponse,
   AppetiteTestRef,
   AppetiteTestRefRepository,
   Complication,
   ComplicationRepository,
   CreatePatientCareSessionProps,
   CreatePatientCareSessionRequest,
   CreatePatientCareSessionResponse,
   DailyCareJournal,
   DailyCareJournalMapper,
   DailyCareJournalRepository,
   EvaluatePatientAppetiteRequest,
   EvaluatePatientAppetiteResponse,
   GetPatientCareSessionRequest,
   GetPatientCareSessionResponse,
   IOrientationService,
   IPatientCareSessionAppService,
   IPatientDailyJournalGenerator,
   MakePatientCareSessionReadyRequest,
   MakePatientCareSessionReadyResponse,
   Medicine,
   MedicineRepository,
   Milk,
   MilkRepository,
   OrientPatientRequest,
   OrientPatientResponse,
   OrientationReference,
   OrientationReferenceRepository,
   OrientationService,
   PatientCareSession,
   PatientCareSessionFactory,
   PatientCareSessionMapper,
   PatientCareSessionRepository,
   PatientCareSessionAppService,
   PatientCurrentState,
   PatientCurrentStateRepository,
   PatientDailyJournalGenerator
} from "@core/nutrition_care";

import {
   PatientCareSessionRepositoryImpl
} from "./repository.web";

import { PatientCareSessionInfraMapper } from "./persistenceDto";
import { PatientACLImpl } from "@core/sharedAcl";
import { PatientContext } from "../patient/context";
import { AppetiteTestReferencePersistenceDto, ComplicationPersistenceDto, DailyJournalPersistenceDto, MedicinePersistenceDto, MilkPersistenceDto, OrientationReferencePersistenceDto, PatientCareSessionPersistenceDto, PatientCurrentStatePersistenceDto } from "./mappers";

export class NutritionCareContext {
   private static instance: NutritionCareContext | null = null;
   private readonly dbConnection: IndexedDBConnection;
   private readonly idGenerator: GenerateUniqueId;
   private readonly eventBus: IEventBus;

   // Infra Mappers
   private readonly appetiteTestRefInfraMapper : InfrastructureMapper<AppetiteTestRef,AppetiteTestReferencePersistenceDto> 
   private readonly complicationInfraMapper : InfrastructureMapper<Complication,ComplicationPersistenceDto>
   private readonly medicineInfraMapper: InfrastructureMapper<Medicine,MedicinePersistenceDto> 
   private readonly milkInfraMapper : InfrastructureMapper<Milk,MilkPersistenceDto> 
   private readonly orientationRefInfraMapper: InfrastructureMapper<OrientationReference,OrientationReferencePersistenceDto> 
   private readonly dailyCareJournalInfraMapper: InfrastructureMapper<DailyCareJournal,DailyJournalPersistenceDto>
   private readonly patientCurrentStateInfraMapper: InfrastructureMapper<PatientCurrentState,PatientCurrentStatePersistenceDto>
   private readonly patientCareSessionInfraMapper: InfrastructureMapper<PatientCareSession,PatientCareSessionPersistenceDto> ;
   
   // Repositories
   private readonly appetiteTestRefRepo: AppetiteTestRefRepository 
   private readonly complicationRepo: ComplicationRepository
   private readonly medicineRepo: MedicineRepository 
   private readonly milkRepo: MilkRepository
   private readonly orientationRepo: OrientationReferenceRepository 
   private readonly dailyCareJournalRepo: DailyCareJournalRepository
   private readonly patientCurrentStateRepo: PatientCurrentStateRepository
   private readonly patientCareSessionRepo: PatientCareSessionRepository;

   // Domain Services
   private readonly patientDailyJournalGenerator: IPatientDailyJournalGenerator;
   private readonly orientationService: IOrientationService;

   // Domain Factories  
   private readonly patientCareSessionFactory: Factory<CreatePatientCareSessionProps, PatientCareSession>;

   // Application Mappers
   private readonly patientCareSessionMapper: PatientCareSessionMapper;
   private readonly dailyJournalMapper: DailyCareJournalMapper;

   // Use Cases
 
   private readonly createPatientCareSessionUC: UseCase<CreatePatientCareSessionRequest, CreatePatientCareSessionResponse>;
   private readonly getPatientCareSessionUC: UseCase<GetPatientCareSessionRequest, GetPatientCareSessionResponse>;
   private readonly addDataUC: UseCase<AddDataToPatientCareSessionRequest, AddDataToPatientCareSessionResponse>;
   private readonly evaluatePatientAppetiteUC: UseCase<EvaluatePatientAppetiteRequest, EvaluatePatientAppetiteResponse>;
   private readonly orientPatientUC: UseCase<OrientPatientRequest, OrientPatientResponse>;
   private readonly makeCareSessionReadyUC: UseCase<MakePatientCareSessionReadyRequest, MakePatientCareSessionReadyResponse>;

   // Application Service
   private readonly patientCareSessionAppService: IPatientCareSessionAppService;

   // ACL
   private readonly patientAcl: PatientACLImpl;

   private constructor(dbConnection: IndexedDBConnection, eventBus: IEventBus) {
      this.dbConnection = dbConnection;
      this.idGenerator = new GenerateUUID();
      this.eventBus = eventBus;

      // ACL
      this.patientAcl = new PatientACLImpl(PatientContext.init(dbConnection, eventBus).getService());

      // Infra Mappers
      this.patientCareSessionInfraMapper = new PatientCareSessionInfraMapper();

      // Repositories
      this.patientCareSessionRepo = new PatientCareSessionRepositoryImpl(
         this.dbConnection,
         this.patientCareSessionInfraMapper,
         this.eventBus
      );

      // Domain Services
      this.patientDailyJournalGenerator = new PatientDailyJournalGenerator(this.idGenerator);
      this.orientationService = new OrientationService();

      // Domain Factories
      this.patientCareSessionFactory = new PatientCareSessionFactory(
         this.idGenerator,
         this.patientDailyJournalGenerator
      );

      // Application Mappers 
      this.dailyJournalMapper = new DailyCareJournalMapper();
      this.patientCareSessionMapper = new PatientCareSessionMapper(
         this.dailyJournalMapper
      );

      // Use Cases
      this.createPatientCareSessionUC = new CreatePatientCareSessionUseCase(
         this.patientCareSessionFactory,
         this.patientCareSessionRepo,
         this.patientAcl
      );

      this.getPatientCareSessionUC = new GetPatientCareSessionUseCase(
         this.patientCareSessionRepo,
         this.patientCareSessionMapper,
         this.patientDailyJournalGenerator
      );

      this.addDataUC = new AddDataToPatientCareSessionUseCase(
         this.patientCareSessionRepo,
         this.patientDailyJournalGenerator
      );

      this.orientPatientUC = new OrientPatientUseCase(
         this.orientationService,
         this.patientDailyJournalGenerator,
         this.patientCareSessionRepo
      );

      this.makeCareSessionReadyUC = new MakePatientCareSessionReadyUseCase(
         this.patientCareSessionRepo
      );

      // Application Service
      this.patientCareSessionAppService = new PatientCareSessionService({
         createUC: this.createPatientCareSessionUC,
         getUC: this.getPatientCareSessionUC,
         addDataUC: this.addDataUC,
         evaluatePatientAppetiteUC: this.evaluatePatientAppetiteUC,
         orientPatientUC: this.orientPatientUC,
         makeCareSessionReadyUC: this.makeCareSessionReadyUC
      });
   }

   static init(dbConnection: IndexedDBConnection, eventBus: IEventBus) {
      if (!NutritionCareContext.instance) {
         this.instance = new NutritionCareContext(dbConnection, eventBus);
      }
      return this.instance as NutritionCareContext;
   }

   getPatientCareSessionService(): IPatientCareSessionAppService {
      return this.patientCareSessionAppService;
   }

   dispose(): void {
      NutritionCareContext.instance = null;
   }
}