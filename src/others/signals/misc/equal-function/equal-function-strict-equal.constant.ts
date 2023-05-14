import { IEqualFunction } from './equal-function.type';

export const EQUAL_FUNCTION_STRICT_EQUAL: IEqualFunction<unknown> = (
  a: unknown,
  b: unknown,
): boolean => {
  return a === b;
};
