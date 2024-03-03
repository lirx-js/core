import { futureUnsubscribe } from '@lirx/unsubscribe';
import { noop } from '@lirx/utils';
import { defaultNotificationObserver } from '../../../../../../misc/notifications/default-notification-observer';
import { IDefaultInNotificationsUnion } from '../../../../../../misc/notifications/default-notifications-union.type';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';
import { INotificationsToValuesObservableOnErrorFunction } from './notifications-to-values-observable-on-error-function.type';

export function notificationsToValuesObservable<GValue>(
  subscribe: IObservable<IDefaultInNotificationsUnion<GValue>>,
  onError: INotificationsToValuesObservableOnErrorFunction = noop,
  maxNumberOfValues: number = Number.POSITIVE_INFINITY,
): IObservable<GValue[]> {
  return (emit: IObserver<GValue[]>): IUnsubscribeOfObservable => {
    const values: GValue[] = [];

    return futureUnsubscribe((unsubscribe: IUnsubscribeOfObservable): IUnsubscribeOfObservable => {
      return subscribe(
        defaultNotificationObserver<GValue>(
          /* next */ (value: GValue): void => {
            values.push(value);
            if (values.length > maxNumberOfValues) {
              values.shift();
            }
          },
          /* complete */ (): void => {
            emit(values);
            unsubscribe();
          },
          /* error */ (error: unknown): void => {
            onError(error);
            unsubscribe();
          },
        ),
      );
    });
  };
}
