import { futureUnsubscribe, IRunning } from '../../../../../../misc/helpers/subscription/future-unsubscribe';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribe } from '../../../../../type/observable.type';

export function firstObservable<GValue>(
  subscribe: IObservable<GValue>,
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribe => {
    return futureUnsubscribe((
      unsubscribe: IUnsubscribe,
      running: IRunning,
    ): IUnsubscribe => {
      return subscribe((value: GValue): void => {
        if (running()) {
          unsubscribe();
          emit(value);
        }
      });
    });
  };
}
