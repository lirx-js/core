import { futureUnsubscribe } from '../../../../../misc/helpers/subscription/future-unsubscribe';
import { defaultNotificationObserver } from '../../../../../misc/notifications/default-notification-observer';
import { IDefaultInNotificationsUnion } from '../../../../../misc/notifications/default-notifications-union.type';
import { IObserver } from '../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribe } from '../../../../type/observable.type';
import { IThenObservableOnFulfilled } from './then-observable-on-fulfilled.type';
import { IThenObservableOnRejected } from './then-observable-on-rejected.type';

export type IThenObservableInNotifications<GInNextValue> = IDefaultInNotificationsUnion<GInNextValue>;

export function thenObservable<GInNextValue, GOut>(
  subscribe: IObservable<IThenObservableInNotifications<GInNextValue>>,
  onFulfilled: IThenObservableOnFulfilled<GInNextValue, GOut>,
  onRejected: IThenObservableOnRejected<GOut>,
): IObservable<GOut> {
  return (emit: IObserver<GOut>): IUnsubscribe => {
    let childUnsubscribe: IUnsubscribe;
    let lastValue: GInNextValue;

    const unsubscribe: IUnsubscribe = futureUnsubscribe((
      unsubscribe: IUnsubscribe,
    ): IUnsubscribe => {
      return subscribe(
        defaultNotificationObserver<GInNextValue>(
          /* next */(value: GInNextValue): void => {
            lastValue = value;
          },
          /* complete */(): void => {
            childUnsubscribe = onFulfilled(lastValue)(emit);
            unsubscribe();
          },
          /* error */(error: unknown): void => {
            childUnsubscribe = onRejected(error)(emit);
            unsubscribe();
          },
        ),
      );
    });

    return (): void => {
      unsubscribe();
      if (childUnsubscribe !== void 0) {
        childUnsubscribe();
      }
    };
  };
}



