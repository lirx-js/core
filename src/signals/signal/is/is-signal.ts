import { isFunction } from '@lirx/utils';
import { isReadonlySignal } from '../../readonly-signal/is/is-readonly-signal';
import { ISignal } from '../signal.type';

export function isSignal<GValue>(
  input: unknown,
): input is ISignal<GValue> {
  return isReadonlySignal(input)
    && isFunction((input as any).set);
}

