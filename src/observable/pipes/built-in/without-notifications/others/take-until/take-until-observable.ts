import { futureUnsubscribe, IRunning, mergeUnsubscribeFunctions } from '@lirx/unsubscribe';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export function takeUntilObservable<GValue>(
  subscribe: IObservable<GValue>,
  until: IObservable<any>,
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    return futureUnsubscribe((
      unsubscribe: IUnsubscribeOfObservable,
      running: IRunning,
    ): IUnsubscribeOfObservable => {
      return mergeUnsubscribeFunctions([
        until(unsubscribe),
        subscribe((value: GValue): void => {
          if (running()) {
            emit(value);
          }
        }),
      ]);
    });
  };
}
