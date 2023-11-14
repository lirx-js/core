import { IObserver } from '../../../observer/type/observer.type';
import { isFunction } from '@lirx/utils';

export function isMaybeObserver<GValue>(
  value: unknown,
): value is IObserver<GValue> {
  return isFunction(value);
}
