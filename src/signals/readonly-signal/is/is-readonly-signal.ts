import { isFunction, isObject } from '@lirx/utils';
import { IReadonlySignal } from '../readonly-signal.type';
import { SIGNAL } from '../traits/symbol/signal.symbol';

export function isReadonlySignal<GValue>(
  input: unknown,
): input is IReadonlySignal<GValue> {
  return (isFunction(input) || isObject(input))
    && (SIGNAL in input);
}
