import { Result } from '@shared';
import { GROWTH_INDICATOR_ERRORS } from './messages';

type ErrorPath = string;

function getNestedError(obj: any, path: string) {
  return path.split('.')
    .reduce((acc, key) => acc?.[key], obj);
}

export function handleGrowthIndicatorError(
  errorPath: ErrorPath,
  details?: string
): Result<never> {
  const error = getNestedError(GROWTH_INDICATOR_ERRORS, errorPath);
  
  if (!error) {
    return Result.fail(`Unknown error code: ${errorPath}`);
  }

  const errorMessage = `[${error.code}] ${error.message}${details ? ` - ${details}` : ''}`;
  
  return Result.fail(errorMessage);
}