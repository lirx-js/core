import { IObservable } from '../../observable/type/observable.type';
import { isSignal } from '../signals/signal/is-signal';
import { isMaybeObservable } from './is-maybe-observable';
import { INotAnObservable, IObservableLike } from './observable-like.type';

export function toObservableStrict<GValue extends INotAnObservable<GValue>>(
  value: IObservableLike<GValue>,
): IObservable<GValue> {
  if (
    isMaybeObservable(value)
    && !isSignal(value)
  ) {
    return value;
  } else {
    throw new TypeError(`Not an observable`);
  }
}
