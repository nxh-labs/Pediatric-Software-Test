import { DomainDate } from "./Date";
import { Result } from "./../../../core";
import { handleError } from "./../../../exceptions";
export class Birthday extends DomainDate {
   constructor(date: string) {
      super(date);
   }
   getAge(): number {
      const today = new Date();
      const birthDate = new Date(this.props._value);

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
         age--;
      }

      return age;
   }

   public isBirthdayToday(): boolean {
      return super.isDateToday();
   }

   toString(): string {
      return super.toString();
   }
   static create(date: string): Result<Birthday> {
      try {
         const birthday = new Birthday(date);
         return Result.ok<Birthday>(birthday);
      } catch (e: any) {
         return handleError(e);
      }
   }
}
