import { isFunction } from '@lirx/utils';
import { IObserver } from '../../../observer/type/observer.type';

export function isMaybeObserver<GValue>(value: unknown): value is IObserver<GValue> {
  return isFunction(value);
}
