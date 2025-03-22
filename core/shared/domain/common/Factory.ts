import { Result } from "../../core";
import { Entity } from "./Entity";

export interface Factory<Props extends Object, T extends Entity<any>> {
   create(props: Props): Result<T> | Promise<Result<T>>;
}
