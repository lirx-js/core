import { SIGNAL } from '../traits/symbol/signal.symbol';
import { IReadonlySignal } from '../readonly-signal.type';
import { isFunction, isObject } from '@lirx/utils';

export function isReadonlySignal<GValue>(
  input: unknown,
): input is IReadonlySignal<GValue> {
  return (isFunction(input) || isObject(input))
    && (SIGNAL in input);
}
