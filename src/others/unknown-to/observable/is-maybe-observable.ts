import { IObservable } from '../../../observable/type/observable.type';
import { isFunction } from '@lirx/utils';

export function isMaybeObservable<GValue>(
  value: unknown,
): value is IObservable<GValue> {
  return isFunction(value);
}
