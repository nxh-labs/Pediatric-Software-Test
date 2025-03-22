import { ValueObject } from "./../../common";
import { Guard, Result } from "./../../../core";
import { EmptyStringError, handleError } from "./../../../exceptions";
export class HumanName extends ValueObject<string> {
   constructor(nom: string) {
      super({ _value: nom });
   }

   protected validate(props: { _value: string }): void {
      if (Guard.isEmpty(props._value).succeeded) {
         throw new EmptyStringError("Le nom ne peut pas être vide.");
      }
      //TODO: Ajouter la regle de la longeur du nom
      // Valider d'autres règles métier si nécessaire
   }

   get lastName(): string {
      const parts = this.props._value.trim().split(" ");
      return parts[parts.length - 1];
   }

   get firstName(): string {
      return this.props._value.trim().split(" ")[0];
   }

   get fullName(): string {
      return this.props._value;
   }

   toString(): string {
      return this.props._value;
   }
   static create(nom: string): Result<HumanName> {
      try {
         const name = new HumanName(nom);
         return Result.ok<HumanName>(name);
      } catch (e: any) {
         return handleError(e);
      }
   }
}
