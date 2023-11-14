import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';
import { futureUnsubscribe, IRunning } from '@lirx/unsubscribe';

export function firstObservable<GValue>(
  subscribe: IObservable<GValue>,
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    return futureUnsubscribe((
      unsubscribe: IUnsubscribeOfObservable,
      running: IRunning,
    ): IUnsubscribeOfObservable => {
      return subscribe((value: GValue): void => {
        if (running()) {
          unsubscribe();
          emit(value);
        }
      });
    });
  };
}
