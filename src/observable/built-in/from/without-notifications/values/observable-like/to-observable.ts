import { IObservable } from '../../../../../type/observable.type';
import { single } from '../single/single';
import { isMaybeObservable } from './is-maybe-observable';
import { INotAnObservable, IObservableLike } from './observable-like.type';

export function toObservable<GValue extends INotAnObservable<GValue>>(
  value: IObservableLike<GValue>,
): IObservable<GValue> {
  return isMaybeObservable(value)
    ? value
    : single(value);
}

