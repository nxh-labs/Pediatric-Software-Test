import { ValueObject } from "../../common";
import { Guard, Result } from "../../../core";
import { ArgumentNotProvidedException, ArgumentInvalidException, handleError } from "../../../exceptions";
import { DomainDate } from "./Date";

export interface IDateframe {
   start: DomainDate;
   end: DomainDate;
}
export class Dateframe extends ValueObject<IDateframe> {
   constructor(props: IDateframe) {
      super(props);
   }
   validate(props: IDateframe): void {
      if (Guard.isEmpty(props.start).succeeded || Guard.isEmpty(props.end).succeeded)
         throw new ArgumentNotProvidedException("La date de debut et la date de fin doit etre fournir.");
      if (!props.start.isBefore(props.end)) throw new ArgumentInvalidException("La date de début doit etre inferieur a la date de fin ou égale");
   }

   get isExpire(): boolean {
      const date = new DomainDate();
      return this.props.end.isAfter(date);
   }

   static create(props: IDateframe): Result<Dateframe> {
      try {
         const dateframe = new Dateframe(props);
         return Result.ok<Dateframe>(dateframe);
      } catch (e: any) {
         return handleError(e);
      }
   }
}
