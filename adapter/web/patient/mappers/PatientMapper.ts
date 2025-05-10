import { Patient } from "@core/patient";
import { InfrastructureMapper } from "@core/shared";
import { PatientPersistenceDto } from "../persistenceDto/PatientPersistenceDto";

export class PatientMapper implements InfrastructureMapper<Patient,PatientPersistenceDto> {
    toPersistence(entity: Patient): PatientPersistenceDto {
     return {
        id: entity.id as string,
        name: entity.getName(),
        birthday: entity.getBirthday(),
        gender: entity.getGender(),
        parents: entity.getParents(),
        contact: entity.getContact(),
        address: entity.getAddress()
     }
    }
    toDomain(record: PatientPersistenceDto): Patient {
        throw new Error("Method not implemented.");
    }
    
}