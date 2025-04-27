import { AggregateID, EmptyStringError, Entity, EntityPropsBaseType, formatError, Guard, handleError, Result, SystemCode } from "@shared";
import { GrowthStandard } from "../constants";
import { ITableData, TableData } from "../valueObjects";

export interface IGrowthReferenceTable extends EntityPropsBaseType {
   name: string;
   code: SystemCode;
   standard: GrowthStandard;
   data: TableData[];
}
export interface CreateGrowthReferenceTableProps {
   name: string;
   code: string;
   standard: GrowthStandard;
   data: ITableData[];
}
export class GrowthReferenceTable extends Entity<IGrowthReferenceTable> {
   getName(): string {
      return this.props.name;
   }
   getCode(): string {
      return this.props.code.unpack();
   }
   getStandard(): GrowthStandard {
      return this.props.standard;
   }
   getTableData(): ITableData[] {
      return this.props.data.map((tableData) => tableData.unpack());
   }
   changeName(name: string) {
      this.props.name = name;
      this.validate();
   }
   changeStandard(standard: GrowthStandard) {
      this.props.standard = standard;
      this.validate();
   }
   changeTableData(tableData: TableData[]) {
      this.props.data = tableData;
      this.validate();
   }
   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("The name of GrowthReferenceTable can't be empty.");
      this._isValid = true;
   }
   static create(createProps: CreateGrowthReferenceTableProps, id: AggregateID): Result<GrowthReferenceTable> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         const tableDataRes = createProps.data.map((tableData) => TableData.create(tableData));
         const combinedRes = Result.combine([codeRes, ...tableDataRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, GrowthReferenceTable.name));
         const growthRefTable = new GrowthReferenceTable({
            id: id,
            props: {
               name: createProps.name,
               standard: createProps.standard,
               code: codeRes.val,
               data: tableDataRes.map((res) => res.val),
            },
         });
         return Result.ok(growthRefTable);
      } catch (e) {
         return handleError(e);
      }
   }
}
