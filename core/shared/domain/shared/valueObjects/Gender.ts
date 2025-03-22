import { ValueObject } from "./../../common";
import { ArgumentInvalidException, handleError } from "../../../exceptions";
import { Result } from "./../../../core";
export enum Sexe {
   MALE = "M",
   FEMALE = "F",
   OTHER = "O",
}

export class Gender extends ValueObject<Sexe> {
   constructor(sexe: Sexe) {
      super({ _value: sexe });
   }

   protected validate(props: { _value: Sexe }): void {
      if (!Object.values(Sexe).includes(props._value)) {
         throw new ArgumentInvalidException("Sexe invalide.");
      }
   }

   public isMale(): boolean {
      return this.props._value === Sexe.MALE;
   }

   public isFemale(): boolean {
      return this.props._value === Sexe.FEMALE;
   }

   public isOther(): boolean {
      return this.props._value === Sexe.OTHER;
   }
   get sexe(): "M" | "F" | "O" {
      return this.props._value;
   }
   public toString(): string {
      switch (this.props._value) {
         case Sexe.MALE:
            return "Masculin";
         case Sexe.FEMALE:
            return "Féminin";
         case Sexe.OTHER:
            return "Autre";
         default:
            return "Inconnu";
      }
   }
   static create(sexe: "M" | "F" | "O"): Result<Gender> {
      try {
         const gender = new Gender(sexe as Sexe);
         return Result.ok<Gender>(gender);
      } catch (e: any) {
       return handleError(e)     }
   }
}
