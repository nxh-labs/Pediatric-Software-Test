import { ApplicationMapper, GenerateUniqueId, InfrastructureMapper, UseCase } from "@shared";
import { GenerateUUID, IndexedDBConnection } from "../common";
import {
   CreateMedicalRecordRequest,
   CreateMedicalRecordResponse,
   CreateMedicalRecordUseCase,
   GetMedicalRecordUseCase,
   MeasurementValidationACLImpl,
   MedicalRecord,
   MedicalRecordDto,
   MedicalRecordMapper,
   MedicalRecordRepository,
   PatientACL,
   UpdateMedicalRecordUseCase,
} from "@core/medical_record";
import { MedicalRecordPersistenceDto } from "./persistenceDto";
import { MedicalRecordInfraMapper } from "./mappers";
import { MedicalRecordRepositoryImpl } from "./repository.web";
import { PatientACLImpl } from "@core/sharedAcl";
import { PatientContext } from "../patient/context";

export class MedicalRecordContext {
   private readonly dbConnection: IndexedDBConnection;
   private readonly infraMapper: InfrastructureMapper<MedicalRecord, MedicalRecordPersistenceDto>;
   private readonly appMapper: ApplicationMapper<MedicalRecord, MedicalRecordDto>;
   private readonly repository: MedicalRecordRepository;
   private readonly idGenerator: GenerateUniqueId;
   //UseCases
   private readonly createUseCase: UseCase<CreateMedicalRecordRequest, CreateMedicalRecordResponse>;
   // ACL
   private readonly patientACL: PatientACL;

   constructor(dbConnection: IndexedDBConnection) {
      // Infrastructure
      this.dbConnection = dbConnection;
      this.infraMapper = new MedicalRecordInfraMapper();
      this.repository = new MedicalRecordRepositoryImpl(this.dbConnection, this.infraMapper);
      this.idGenerator = new GenerateUUID();

      // Application
      this.appMapper = new MedicalRecordMapper();
      // ACl
      this.patientACL = new PatientACLImpl(PatientContext.init(dbConnection).getService());

      // Application // UseCases
      this.createUseCase = new CreateMedicalRecordUseCase(this.idGenerator, this.repository, this.patientACL);
      this.getUseCase = new GetMedicalRecordUseCase(this.repository,this.appMapper)
      this.updateUseCase = new UpdateMedicalRecordUseCase(this.repository)

      
   }
}
