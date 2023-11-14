import { isFunction } from '@lirx/utils';
import { ISignal } from '../signal.type';
import { isReadonlySignal } from '../../readonly-signal/is/is-readonly-signal';

export function isSignal<GValue>(
  input: unknown,
): input is ISignal<GValue> {
  return isReadonlySignal(input)
    && isFunction((input as any).set);
}

