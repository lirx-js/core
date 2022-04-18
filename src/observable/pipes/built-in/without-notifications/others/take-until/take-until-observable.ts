import { futureUnsubscribe, IRunning } from '../../../../../../misc/helpers/subscription/future-unsubscribe';
import { mergeUnsubscribeFunctions } from '../../../../../../misc/helpers/subscription/merge-unsubscribe-functions';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribe } from '../../../../../type/observable.type';

export function takeUntilObservable<GValue>(
  subscribe: IObservable<GValue>,
  until: IObservable<any>,
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribe => {
    return futureUnsubscribe((
      unsubscribe: IUnsubscribe,
      running: IRunning,
    ): IUnsubscribe => {
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
