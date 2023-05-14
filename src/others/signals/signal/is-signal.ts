import { isNullish } from '@lirx/utils';
import { SIGNAL } from './signal.symbol';
import { ISignal } from './signal.type';

export function isSignal<GValue>(
  input: unknown,
): input is ISignal<GValue> {
  return !isNullish(input)
    && Object.hasOwn((input as object), SIGNAL);
}
