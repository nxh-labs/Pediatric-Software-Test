import { ValueObject } from "./../../common";
import { Guard, Result } from "./../../../core";
import { ArgumentNotProvidedException, ArgumentInvalidException, handleError } from "../../../exceptions";

import { Time } from "./Time";

export interface ITimeframe {
   start: Time;
   end: Time;
}
export class Timeframe extends ValueObject<ITimeframe> {
   constructor(props: ITimeframe) {
      super(props);
   }
   validate(props: ITimeframe): void {
      if (Guard.isEmpty(props.start).succeeded || Guard.isEmpty(props.end).succeeded)
         throw new ArgumentNotProvidedException("L'heure de debut et l'heure de fin doit etre fournir.");

      if (!props.start.isBefore(props.end)) throw new ArgumentInvalidException("L'heure de début doit etre inferieur a l'heure de fin ou égale");
   }

   get isExpire(): boolean {
      const time = new Time();
      return this.props.end.isAfter(time);
   }

   static create(props: ITimeframe): Result<Timeframe> {
      try {
         const timeframe = new Timeframe(props);
         return Result.ok<Timeframe>(timeframe);
      } catch (e: any) {
         return handleError(e);
      }
   }
}
