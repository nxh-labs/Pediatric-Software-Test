import { ArgumentInvalidException, handleError } from "../../../exceptions";
import { DomainDate } from "./Date";
import { Result } from "./../../../core";
export class RegistrationDate extends DomainDate {
   protected validate(props: { _value: string }): void {
      super.validate(props);
      if (this.isValideRegistrationDate(props)) {
         throw new ArgumentInvalidException("Date d'enregistrement invalide. Assurez-vous que la date n'est pas dans le future.");
      }
   }
   public isValideRegistrationDate(props?: { _value: string }): boolean {
      const currentDate = new Date();
      const registrationDate = new Date(this.props._value || (props as { _value: string })._value);
      return registrationDate <= currentDate;
   }
   toString(): string {
      return super.toString();
   }
   static create(date: string): Result<RegistrationDate> {
      try {
         const rDate = new RegistrationDate(date);
         return Result.ok<RegistrationDate>(rDate);
      } catch (e: any) {
         return handleError(e);
      }
   }
}
