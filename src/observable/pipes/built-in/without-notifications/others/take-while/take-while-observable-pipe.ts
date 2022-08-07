import { IObservable } from '../../../../../type/observable.type';
import { IObservablePipe } from '../../../../type/observable-pipe.type';
import { takeWhileObservable } from './take-while-observable';
import { ITakeWhileObservablePredicateFunction } from './take-while-observable-predicate-function.type';

export function takeWhileObservablePipe<GValue>(
  predicate: ITakeWhileObservablePredicateFunction<GValue>,
): IObservablePipe<GValue, GValue> {
  return (subscribe: IObservable<GValue>): IObservable<GValue> => {
    return takeWhileObservable<GValue>(subscribe, predicate);
  };
}
