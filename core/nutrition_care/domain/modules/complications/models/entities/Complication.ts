import { AggregateID, Entity, EntityPropsBaseType, formatError, handleError, Result, SystemCode } from "@shared";

export interface IComplication extends EntityPropsBaseType {
   name: string;
   code: SystemCode;
   description: string;
}

export interface CreateComplicationProps {
   name: string;
   code: string;
   description: string;
}
export class Complication extends Entity<IComplication> {
   getName(): string {
      return this.props.name;
   }
   getCode(): string {
      return this.props.code.unpack();
   }
   getDescription(): string {
      return this.props.description;
   }
   changeName(name: string) {
      this.props.name = name;
      this.validate();
   }
   changeDescription(description: string) {
      this.props.description = description;
      this.validate();
   }
   public validate(): void {
      throw new Error("Method not implemented.");
   }
   static create(createProps: CreateComplicationProps, id: AggregateID): Result<Complication> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         if (codeRes.isFailure) return Result.fail(formatError(codeRes, Complication.name));
         const complication = new Complication({
            id,
            props: {
               name: createProps.name,
               code: codeRes.val,
               description: createProps.description,
            },
         });
         return Result.ok(complication);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
