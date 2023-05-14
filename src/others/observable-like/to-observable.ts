import { single } from '../../observable/built-in/from/without-notifications/values/single/single';
import { IObservable } from '../../observable/type/observable.type';
import { isSignal } from '../signals/signal/is-signal';
import { isMaybeObservable } from './is-maybe-observable';
import { INotAnObservable, IObservableLike } from './observable-like.type';

export function toObservable<GValue extends INotAnObservable<GValue>>(
  input: IObservableLike<GValue>,
): IObservable<GValue> {
  return isSignal(input)
    ? input.toObservable({ emitCurrentValue: true })
    : (
      isMaybeObservable(input)
        ? input
        : single(input)
    );
}

