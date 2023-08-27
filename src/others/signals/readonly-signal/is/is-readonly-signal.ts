import { SIGNAL } from '../traits/symbol/signal.symbol';
import { IReadonlySignal } from '../readonly-signal.type';
import { isFunction } from '@lirx/utils';

export function isReadonlySignal<GValue>(
  input: unknown,
): input is IReadonlySignal<GValue> {
  return isFunction(input)
    && (SIGNAL in input);
}
