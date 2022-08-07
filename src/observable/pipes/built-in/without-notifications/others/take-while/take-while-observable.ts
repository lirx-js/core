import { futureUnsubscribe, IRunning } from '../../../../../../misc/helpers/subscription/future-unsubscribe';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribe } from '../../../../../type/observable.type';
import { ITakeWhileObservablePredicateFunction } from './take-while-observable-predicate-function.type';

export function takeWhileObservable<GValue>(
  subscribe: IObservable<GValue>,
  predicate: ITakeWhileObservablePredicateFunction<GValue>,
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribe => {
    return futureUnsubscribe((
      unsubscribe: IUnsubscribe,
      running: IRunning,
    ): IUnsubscribe => {
      let index: number = 0;
      return subscribe((value: GValue): void => {
        if (running()) {
          if (predicate(value, index++)) {
            emit(value);
          } else {
            unsubscribe();
          }
        }
      });
    });
  };
}
