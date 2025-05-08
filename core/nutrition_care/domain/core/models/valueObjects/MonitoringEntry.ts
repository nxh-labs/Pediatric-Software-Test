import { DomainDate, formatError, Guard, handleError, Result, UnitCode, ValueObject } from "@shared";
export enum MonitoringEntryType {
   ANTHROPOMETRIC = "anthropometric",
   BIOCHEMICAL = "biochemical",
}
export enum MonitoredValueSource {
   CALCULATED = "calculated",
   MANUAL = "manual",
   IMPORTED = "imported",
}
export interface IMonitoringEntry {
   date: DomainDate;
   type: MonitoringEntryType;
   value: number;
   unit: UnitCode;
   source: MonitoredValueSource;
}
export interface CreateMonitoringEntry {
   date: string;
   type: MonitoringEntryType;
   value: number;
   unit: string;
   source: MonitoredValueSource;
}

export class MonitoringEntry extends ValueObject<IMonitoringEntry> {
   protected validate(props: Readonly<IMonitoringEntry>): void {
      if (Guard.isNegative(props.value).succeeded) {
         throw new Error("MonitoringEntry value can't be negative.");
      }
   }
   static create(createProps: CreateMonitoringEntry): Result<MonitoringEntry> {
      try {
         const dateRes = DomainDate.create(createProps.date);
         const unitRes = UnitCode.create(createProps.unit);
         const combinedRes = Result.combine([dateRes, unitRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, MonitoringEntry.name));
         const props: IMonitoringEntry = {
            date: dateRes.val,
            type: createProps.type,
            value: createProps.value,
            unit: unitRes.val,
            source: createProps.source,
         };
         return Result.ok(new MonitoringEntry(props));
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
