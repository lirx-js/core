import { EQUAL_FUNCTION_NON_PRIMITIVES_ALWAYS_FALSE } from './equal-function-non-primitives-always-false.constant';
import { IEqualFunction } from './equal-function.type';

export const DEFAULT_SIGNAL_EQUAL_FUNCTION: IEqualFunction<unknown> = EQUAL_FUNCTION_NON_PRIMITIVES_ALWAYS_FALSE;
