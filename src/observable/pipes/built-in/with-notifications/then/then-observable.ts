import { defaultNotificationObserver } from '../../../../../misc/notifications/default-notification-observer';
import { IDefaultInNotificationsUnion } from '../../../../../misc/notifications/default-notifications-union.type';
import { IObserver } from '../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../type/observable.type';
import { IThenObservableOnFulfilled } from './then-observable-on-fulfilled.type';
import { IThenObservableOnRejected } from './then-observable-on-rejected.type';
import { futureUnsubscribe } from '@lirx/unsubscribe';

export type IThenObservableInNotifications<GInNextValue> = IDefaultInNotificationsUnion<GInNextValue>;

export function thenObservable<GInNextValue, GOut>(
  subscribe: IObservable<IThenObservableInNotifications<GInNextValue>>,
  onFulfilled: IThenObservableOnFulfilled<GInNextValue, GOut>,
  onRejected: IThenObservableOnRejected<GOut>,
): IObservable<GOut> {
  return (emit: IObserver<GOut>): IUnsubscribeOfObservable => {
    let childUnsubscribe: IUnsubscribeOfObservable;
    let lastValue: GInNextValue;

    const unsubscribe: IUnsubscribeOfObservable = futureUnsubscribe((
      unsubscribe: IUnsubscribeOfObservable,
    ): IUnsubscribeOfObservable => {
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



