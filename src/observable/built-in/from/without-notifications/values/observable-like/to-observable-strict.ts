import { IObservable } from '../../../../../type/observable.type';
import { isMaybeObservable } from './is-maybe-observable';
import { INotAnObservable, IObservableLike } from './observable-like.type';

export function toObservableStrict<GValue extends INotAnObservable<GValue>>(
  value: IObservableLike<GValue>,
): IObservable<GValue> {
  if (isMaybeObservable(value)) {
    return value;
  } else {
    throw new TypeError(`Not an observable`);
  }
}
