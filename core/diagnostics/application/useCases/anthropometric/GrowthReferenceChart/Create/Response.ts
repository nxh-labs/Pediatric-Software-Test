import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateGrowthReferenceChartResponse = Either<ExceptionBase | unknown, Result<{ id: AggregateID }>>;
