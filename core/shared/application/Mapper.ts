import { Entity } from "../domain";

export interface ApplicationMapper<
  DomainEntity extends Entity<any>,
  Dto extends Object
> {
  toResponse(entiry: DomainEntity): Dto;
}
