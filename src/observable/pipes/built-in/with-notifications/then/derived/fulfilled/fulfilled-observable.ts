import { futureUnsubscribe } from '@lirx/unsubscribe';
import { IErrorNotification } from '../../../../../../../misc/notifications/built-in/error/error-notification.type';
import { IDefaultInNotificationsUnion } from '../../../../../../../misc/notifications/default-notifications-union.type';
import { IObserver } from '../../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../../type/observable.type';
import { IThenObservableInNotifications } from '../../then-observable';
import { IThenObservableOnFulfilled } from '../../then-observable-on-fulfilled.type';
import { IFulfilledObservableOutNotifications } from './fulfilled-observable-out-notifications.type';

export function fulfilledObservable<GInNextValue, GOut>(
  subscribe: IObservable<IThenObservableInNotifications<GInNextValue>>,
  onFulfilled: IThenObservableOnFulfilled<GInNextValue, GOut>,
): IObservable<IFulfilledObservableOutNotifications<GOut>> {
  return (
    emit: IObserver<IFulfilledObservableOutNotifications<GOut>>,
  ): IUnsubscribeOfObservable => {
    let childUnsubscribe: IUnsubscribeOfObservable;
    let lastValue: GInNextValue;

    const unsubscribe: IUnsubscribeOfObservable = futureUnsubscribe(
      (unsubscribe: IUnsubscribeOfObservable): IUnsubscribeOfObservable => {
        return subscribe((notification: IDefaultInNotificationsUnion<GInNextValue>): void => {
          switch (notification.name) {
            case 'next':
              lastValue = notification.value;
              break;
            case 'complete':
              childUnsubscribe = onFulfilled(lastValue)(emit);
              unsubscribe();
              break;
            case 'error':
              emit(notification as IErrorNotification);
              unsubscribe();
              break;
          }
        });
      },
    );

    return (): void => {
      unsubscribe();
      if (childUnsubscribe !== void 0) {
        childUnsubscribe();
      }
    };
  };

  // return thenObservable<GInNextValue, IFulfilledObservableOutNotifications<GOut>>(
  //   subscribe,
  //   onFulfilled,
  //   throwError,
  // );
}
