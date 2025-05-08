import { AggregateID, DomainDate, EntityPropsBaseType, Factory, formatError, GenerateUniqueId, handleError, Result, SystemCode } from "@shared";
import { PatientCareSession, PatientCurrentState } from "../models";
import { ORIENTATION_REF_CODES } from "../../../../constants";

export interface CreatePatientCareSessionProps extends EntityPropsBaseType {
   patientId: AggregateID;
}

export class PatientCareSessionFactory implements Factory<CreatePatientCareSessionProps, PatientCareSession> {
   constructor(private idGenerator: GenerateUniqueId) {}
   async create(props: CreatePatientCareSessionProps): Promise<Result<PatientCareSession>> {
      try {
         const startDate = new DomainDate();
         const defaultOrientation = {
            name: `Default Orientation(${ORIENTATION_REF_CODES.ORIENTED_TO_HOME})`,
            code: new SystemCode({ _value: ORIENTATION_REF_CODES.ORIENTED_TO_HOME }),
         };
         const patientCurrentStateRes = PatientCurrentState.create(
            {
               anthropometricData: {} as never,
               appetiteTestResult: {},
               biologicalData: {} as never,
               clinicalSignData: {} as never,
               complicationData: {},
            },
            this.idGenerator.generate().toValue(),
         );

         if (patientCurrentStateRes.isFailure) return Result.fail(formatError(patientCurrentStateRes, PatientCareSessionFactory.name));
         const patientCareSession = new PatientCareSession({
            id: this.idGenerator.generate().toValue(),
            props: {
               patientId: props.patientId,
               startDate,
               orientation: defaultOrientation,
               carePhases: [],
               dailyJournals: [],
               currentState: patientCurrentStateRes.val,
               status: "not_ready",
            },
         });
         return Result.ok(patientCareSession);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
