import { noop } from '@lirx/utils';
import { defaultNotificationObserver } from '../../../../../../../../misc/notifications/default-notification-observer';
import { IDefaultInNotificationsUnion } from '../../../../../../../../misc/notifications/default-notifications-union.type';
import { IObserver } from '../../../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../../../type/observable.type';
import { INotificationsToImmediateObservableOnErrorFunction } from './notifications-to-immediate-observable-on-error-function.type';
import { futureUnsubscribe } from '@lirx/unsubscribe';

export function notificationsToImmediateObservable<GValue>(
  subscribe: IObservable<IDefaultInNotificationsUnion<GValue>>,
  onError: INotificationsToImmediateObservableOnErrorFunction = noop,
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    return futureUnsubscribe((
      unsubscribe: IUnsubscribeOfObservable,
    ): IUnsubscribeOfObservable => {
      return subscribe(
        defaultNotificationObserver<GValue>(
          /* next */(value: GValue): void => {
            emit(value);
          },
          /* complete */(): void => {
            unsubscribe();
          },
          /* error */(error: unknown): void => {
            onError(error);
            unsubscribe();
          },
        ),
      );
    });
  };
}


