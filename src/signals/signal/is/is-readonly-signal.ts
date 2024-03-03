import { isFunction } from '@lirx/utils';
import { SIGNAL } from '../signal.symbol';
import { IReadonlySignal } from '../types/readonly-signal.type';

export function isReadonlySignal<GValue>(input: unknown): input is IReadonlySignal<GValue> {
  return isFunction(input) && SIGNAL in input;
}
