import { IObservable } from '../../../../../type/observable.type';

export function isMaybeObservable<GValue>(
  value: unknown,
): value is IObservable<GValue> {
  return (typeof value === 'function');
}
