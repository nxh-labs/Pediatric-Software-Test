import { Either, ExceptionBase, Result } from "@shared";
import { IMilkSuggestionResult } from "../../../../domain";

export type SuggestMilkResponse = Either<ExceptionBase | unknown, Result<IMilkSuggestionResult>>;
