import { futureUnsubscribe, IRunning } from '@lirx/utils';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';
import { IFindObservablePipeConditionFunction } from './find-observable-pipe-condition-function.type';

export function findObservable<GValue>(
  subscribe: IObservable<GValue>,
  condition: IFindObservablePipeConditionFunction<GValue>,
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    return futureUnsubscribe((
      unsubscribe: IUnsubscribeOfObservable,
      running: IRunning,
    ): IUnsubscribeOfObservable => {
      return subscribe((value: GValue): void => {
        if (running() && condition(value)) {
          unsubscribe();
          emit(value);
        }
      });
    });
  };
}
