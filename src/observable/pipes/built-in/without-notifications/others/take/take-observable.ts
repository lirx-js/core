import { futureUnsubscribe, IRunning } from '../../../../../../misc/helpers/subscription/future-unsubscribe';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { empty } from '../../../../../built-in/from/without-notifications/values/empty/empty';
import { IObservable, IUnsubscribe } from '../../../../../type/observable.type';

export function takeObservable<GValue>(
  subscribe: IObservable<GValue>,
  count: number,
): IObservable<GValue> {
  if (count <= 0) {
    return empty();
  } else {
    return (emit: IObserver<GValue>): IUnsubscribe => {
      return futureUnsubscribe((
        unsubscribe: IUnsubscribe,
        running: IRunning,
      ): IUnsubscribe => {
        return subscribe((value: GValue): void => {
          if (running()) {
            --count;
            if (count === 0) {
              unsubscribe();
            }
            emit(value);
          }
        });
      });
    };
  }
}
