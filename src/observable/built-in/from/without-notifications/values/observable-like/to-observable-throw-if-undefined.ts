import { IObservable } from '../../../../../type/observable.type';
import { INotAnObservable, IObservableLike } from './observable-like.type';
import { toObservable } from './to-observable';

export function toObservableThrowIfUndefined<GValue extends INotAnObservable<GValue>>(
  value: IObservableLike<GValue>,
): IObservable<GValue> {
  if (value === void 0) {
    throw new TypeError(`Not an observable`);
  } else {
    return toObservable(value);
  }
}
