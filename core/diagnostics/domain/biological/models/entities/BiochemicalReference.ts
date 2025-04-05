import {
   AggregateID,
   ArgumentOutOfRangeException,
   EmptyStringError,
   Entity,
   EntityPropsBaseType,
   formatError,
   Guard,
   handleError,
   Result,
   SystemCode,
   UnitCode,
} from "@shared";
import { BiochemicalRange, CreateBiochemicalRange, IBiochemicalRange } from "./../valueObjects";

export interface IBiochemicalReference extends EntityPropsBaseType {
   name: string;
   code: SystemCode;
   unit: UnitCode;
   availableUnits: UnitCode[];
   ranges: BiochemicalRange[];
   source: string;
   notes: string[];
}
export interface CreateBiochemicalReference {
   name: string;
   code: string;
   unit: string;
   availableUnits: string[];
   ranges: CreateBiochemicalRange[];
   source: string;
   notes: string[];
}
export class BiochemicalReference extends Entity<IBiochemicalReference> {
   static MIN_RANGE = 1;
   getName(): string {
      return this.props.name;
   }
   getCode(): string {
      return this.props.unit.unpack();
   }
   getRanges(): IBiochemicalRange[] {
      return this.props.ranges.map((range) => range.unpack());
   }
   getSource(): string {
      return this.props.source;
   }
   getNotes(): string[] {
      return this.props.notes;
   }
   getUnits(): { defaultUnit: string; availableUnits: string[] } {
      return { defaultUnit: this.props.unit.unpack(), availableUnits: this.props.availableUnits.map((unit) => unit.unpack()) };
   }
   changeName(name: string) {
      this.props.name = name;
      this.validate();
   }
   changeUnit(units: { defaultUnit: UnitCode; availableUnits: UnitCode[] }) {
      this.props.unit = units.defaultUnit;
      this.props.availableUnits = units.availableUnits;
      this.validate();
   }
   changeRanges(biochemicalRanges: BiochemicalRange[]) {
      this.props.ranges = biochemicalRanges;
      this.validate();
   }
   changeSource(source: string) {
      this.props.source = source;
      this.validate();
   }
   changeNotes(notes: string[]) {
      this.props.notes = notes;
      this.validate();
   }
   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("The name of biochemicalReference can't be empty.");
      if (Guard.isEmpty(this.props.source).succeeded) throw new EmptyStringError("The source of BiochemicalReference must be provide.");
      if (this.props.notes.some((note) => Guard.isEmpty(note).succeeded)) throw new EmptyStringError("The note can't be empty when it provide.");
      if (this.props.ranges.length < BiochemicalReference.MIN_RANGE)
         throw new ArgumentOutOfRangeException("In a biochemicalReference you must provide 1 range of BiochemicalRange.");
      this._isValid = true;
   }
   static create(createProps: CreateBiochemicalReference, id: AggregateID): Result<BiochemicalReference> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         const unitRes = UnitCode.create(createProps.unit);
         const availableUnitsRes = createProps.availableUnits.map(UnitCode.create);
         const rangesRes = createProps.ranges.map(BiochemicalRange.create);
         const combinedRes = Result.combine([codeRes, unitRes, ...availableUnitsRes, ...rangesRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, BiochemicalReference.name));
         return Result.ok(
            new BiochemicalReference({
               id,
               props: {
                  code: codeRes.val,
                  name: createProps.name,
                  unit: unitRes.val,
                  availableUnits: availableUnitsRes.map((res) => res.val),
                  ranges: rangesRes.map((res) => res.val),
                  source: createProps.source,
                  notes: createProps.notes,
               },
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
