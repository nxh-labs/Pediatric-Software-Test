import { Either, ExceptionBase, Result } from "@shared";

export type OrientResponse = Either<ExceptionBase | unknown, Result<{ name: string; code: string }>>;
