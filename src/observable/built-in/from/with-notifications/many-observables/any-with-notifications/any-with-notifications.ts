import { futureUnsubscribe, IRunning, mergeUnsubscribeFunctions } from '@lirx/unsubscribe';
import { STATIC_COMPLETE_NOTIFICATION } from '../../../../../../misc/notifications/built-in/complete/complete-notification.constant';
import { createErrorNotification } from '../../../../../../misc/notifications/built-in/error/create-error-notification';
import { createNextNotification } from '../../../../../../misc/notifications/built-in/next/create-next-notification';
import { defaultNotificationObserver } from '../../../../../../misc/notifications/default-notification-observer';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IGenericObservable, IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';
import { emptyWithNotifications } from '../../values/empty/empty-with-notifications';
import {
  IAnyWithNotificationsObservableNotifications,
  IAnyWithNotificationsObservablesValues,
  IGenericAnyWithNotificationsInObservables,
} from './any-with-notifications-observable-notifications.type';

export function anyWithNotifications<GObservables extends IGenericAnyWithNotificationsInObservables>(
  observables: GObservables,
): IObservable<IAnyWithNotificationsObservableNotifications<GObservables>> {
  type GValues = IAnyWithNotificationsObservablesValues<GObservables>;
  type GNotifications = IAnyWithNotificationsObservableNotifications<GObservables>;

  const length: number = observables.length;

  if (length === 0) {
    return emptyWithNotifications();
  } else {
    return (emit: IObserver<GNotifications>): IUnsubscribeOfObservable => {
      const values: unknown[] = Array.from({ length });
      const errored: boolean[] = Array.from({ length });
      let errorCount: number = 0;

      return futureUnsubscribe((
        unsubscribe: IUnsubscribeOfObservable,
        running: IRunning,
      ): IUnsubscribeOfObservable => {
        return mergeUnsubscribeFunctions(
          observables
            .map((subscribe: IGenericObservable, index: number): IUnsubscribeOfObservable => {
              return futureUnsubscribe((
                localUnsubscribe: IUnsubscribeOfObservable,
              ): IUnsubscribeOfObservable => {
                return subscribe(
                  defaultNotificationObserver<GValues>(
                    /* next */(value: GValues): void => {
                      values[index] = value;
                    },
                    /* complete */(): void => {
                      emit(createNextNotification<GValues>(values[index] as unknown as GValues));
                      if (running()) {
                        emit(STATIC_COMPLETE_NOTIFICATION);
                      }
                      unsubscribe();
                    },
                    /* error */(error: unknown): void => {
                      if (!errored[index]) {
                        values[index] = error;
                        errored[index] = true;
                        errorCount++;
                      }
                      if (errorCount === length) {
                        emit(createErrorNotification<AggregateError>(new AggregateError(values, `All observables threw`)));
                        unsubscribe();
                      } else {
                        localUnsubscribe();
                      }
                    },
                  ),
                );
              });
            }),
        );
      });
    };
  }
}

