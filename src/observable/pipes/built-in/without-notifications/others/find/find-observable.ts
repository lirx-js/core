import { futureUnsubscribe, IRunning } from '../../../../../../misc/helpers/subscription/future-unsubscribe';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribe } from '../../../../../type/observable.type';
import { IFindObservablePipeConditionFunction } from './find-observable-pipe-condition-function.type';

export function findObservable<GValue>(
  subscribe: IObservable<GValue>,
  condition: IFindObservablePipeConditionFunction<GValue>,
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribe => {
    return futureUnsubscribe((
      unsubscribe: IUnsubscribe,
      running: IRunning,
    ): IUnsubscribe => {
      return subscribe((value: GValue): void => {
        if (running() && condition(value)) {
          unsubscribe();
          emit(value);
        }
      });
    });
  };
}
