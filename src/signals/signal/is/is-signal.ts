import { isFunction } from '@lirx/utils';
import { ISignal } from '../types/signal.type';
import { isReadonlySignal } from './is-readonly-signal';

export function isSignal<GValue>(input: unknown): input is ISignal<GValue> {
  return isReadonlySignal(input) && isFunction((input as any).set);
}
