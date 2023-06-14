import { IObservable } from '../../observable/type/observable.type';

export function isMaybeObservable<GValue>(
  value: unknown,
): value is IObservable<GValue> {
  return (typeof value === 'function');
}
