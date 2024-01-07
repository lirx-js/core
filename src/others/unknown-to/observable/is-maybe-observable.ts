import { isFunction } from '@lirx/utils';
import { IObservable } from '../../../observable/type/observable.type';

export function isMaybeObservable<GValue>(
  value: unknown,
): value is IObservable<GValue> {
  return isFunction(value);
}
