import { noop } from '../../../../../../misc/helpers/noop';
import { futureUnsubscribe } from '../../../../../../misc/helpers/subscription/future-unsubscribe';
import { defaultNotificationObserver } from '../../../../../../misc/notifications/default-notification-observer';
import { IDefaultInNotificationsUnion } from '../../../../../../misc/notifications/default-notifications-union.type';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribe } from '../../../../../type/observable.type';
import { INotificationsToValuesObservableOnErrorFunction } from './notifications-to-values-observable-on-error-function.type';

export function notificationsToValuesObservable<GValue>(
  subscribe: IObservable<IDefaultInNotificationsUnion<GValue>>,
  onError: INotificationsToValuesObservableOnErrorFunction = noop,
  maxNumberOfValues: number = Number.POSITIVE_INFINITY,
): IObservable<GValue[]> {
  return (emit: IObserver<GValue[]>): IUnsubscribe => {
    const values: GValue[] = [];

    return futureUnsubscribe((
      unsubscribe: IUnsubscribe,
    ): IUnsubscribe => {
      return subscribe(
        defaultNotificationObserver<GValue>(
          /* next */(value: GValue): void => {
            values.push(value);
            if (values.length > maxNumberOfValues) {
              values.shift();
            }
          },
          /* complete */(): void => {
            emit(values);
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


