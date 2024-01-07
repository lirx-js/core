import { futureUnsubscribe, mergeUnsubscribeFunctions } from '@lirx/unsubscribe';
import { STATIC_COMPLETE_NOTIFICATION } from '../../../../../../misc/notifications/built-in/complete/complete-notification.constant';
import { createErrorNotification } from '../../../../../../misc/notifications/built-in/error/create-error-notification';
import { createNextNotification } from '../../../../../../misc/notifications/built-in/next/create-next-notification';
import { defaultNotificationObserver } from '../../../../../../misc/notifications/default-notification-observer';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IGenericObservable, IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';
import { emptyWithNotifications } from '../../values/empty/empty-with-notifications';
import {
  IGenericMergeWithNotificationsInObservables,
  IMergeWithNotificationsObservableNotifications,
  IMergeWithNotificationsObservablesValues,
} from './merge-with-notifications-observable-notifications.type';

export function mergeWithNotifications<GObservables extends IGenericMergeWithNotificationsInObservables>(
  observables: GObservables,
): IObservable<IMergeWithNotificationsObservableNotifications<GObservables>> {
  type GValues = IMergeWithNotificationsObservablesValues<GObservables>;
  type GNotifications = IMergeWithNotificationsObservableNotifications<GObservables>;

  const length: number = observables.length;

  if (length === 0) {
    return emptyWithNotifications();
  } else {
    return (emit: IObserver<GNotifications>): IUnsubscribeOfObservable => {
      return futureUnsubscribe((
        unsubscribe: IUnsubscribeOfObservable,
      ): IUnsubscribeOfObservable => {
        const completed: boolean[] = Array.from({ length });
        let completeCount: number = 0;

        return mergeUnsubscribeFunctions(
          observables
            .map((subscribe: IGenericObservable, index: number): IUnsubscribeOfObservable => {
              return futureUnsubscribe((
                localUnsubscribe: IUnsubscribeOfObservable,
              ): IUnsubscribeOfObservable => {
                return subscribe(
                  defaultNotificationObserver<GValues>(
                    /* next */(value: GValues): void => {
                      emit(createNextNotification<GValues>(value));
                    },
                    /* complete */(): void => {
                      if (!completed[index]) {
                        completed[index] = true;
                        completeCount++;
                      }
                      if (completeCount === length) {
                        emit(STATIC_COMPLETE_NOTIFICATION);
                        unsubscribe();
                      }
                      localUnsubscribe();
                    },
                    /* error */(error: unknown): void => {
                      emit(createErrorNotification(error));
                      unsubscribe();
                      localUnsubscribe();
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
