import { futureUnsubscribe, IRunning } from '../../../../../../misc/helpers/subscription/future-unsubscribe';
import { ICompleteNotification } from '../../../../../../misc/notifications/built-in/complete/complete-notification.type';
import { IErrorNotification } from '../../../../../../misc/notifications/built-in/error/error-notification.type';
import { IGenericNotification } from '../../../../../../misc/notifications/notification.type';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribe } from '../../../../../type/observable.type';

export type IAutoUnsubscribeObservableNotifications =
  | ICompleteNotification
  | IErrorNotification
  | IGenericNotification;

/**
 * This pipe automatically unsubscribes of the source NotificationObservable if a 'complete' or 'error' Notification is received.
 * This may be useful when sharing a NotificationObservable
 *
 * @experimental
 */
export function autoUnsubscribeObservableWithNotifications<GNotifications extends IAutoUnsubscribeObservableNotifications>(
  subscribe: IObservable<GNotifications>,
): IObservable<GNotifications> {
  return (emit: IObserver<GNotifications>): IUnsubscribe => {
    return futureUnsubscribe((
      unsubscribe: IUnsubscribe,
      running: IRunning,
    ): IUnsubscribe => {
      return subscribe((notification: GNotifications): void => {
        if (running()) {
          if (
            (notification.name === 'complete')
            || (notification.name === 'error')
          ) {
            unsubscribe();
          }
          emit(notification);
        }
      });
    });
  };
}
