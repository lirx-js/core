import { IEqualFunction } from './equal-function.type';

export const EQUAL_FUNCTION_NON_PRIMITIVES_ALWAYS_FALSE: IEqualFunction<unknown> = (
  a: unknown,
  b: unknown,
): boolean => {
  const typeA = typeof a;
  const typeB = typeof a;
  if (typeA === typeB) {
    if (typeA === 'object') {
      return (a === null) && (b === null);
    } else {
      return a === b;
    }
  } else {
    return false;
  }
};
