import { futureUnsubscribe, IRunning } from '../../../../../../misc/helpers/subscription/future-unsubscribe';
import { mergeUnsubscribeFunctions } from '../../../../../../misc/helpers/subscription/merge-unsubscribe-functions';
import { STATIC_COMPLETE_NOTIFICATION } from '../../../../../../misc/notifications/built-in/complete/complete-notification.constant';
import { createErrorNotification } from '../../../../../../misc/notifications/built-in/error/create-error-notification';
import { createNextNotification } from '../../../../../../misc/notifications/built-in/next/create-next-notification';
import { defaultNotificationObserver } from '../../../../../../misc/notifications/default-notification-observer';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IGenericObservable, IObservable, IUnsubscribe } from '../../../../../type/observable.type';
import { emptyWithNotifications } from '../../values/empty/empty-with-notifications';
import {
  IGenericRaceWithNotificationsInObservables,
  IRaceWithNotificationsObservableNotifications,
  IRaceWithNotificationsObservablesValues,
} from './race-with-notifications-observable-notifications.type';

export function raceWithNotifications<GObservables extends IGenericRaceWithNotificationsInObservables>(
  observables: GObservables,
): IObservable<IRaceWithNotificationsObservableNotifications<GObservables>> {
  type GValues = IRaceWithNotificationsObservablesValues<GObservables>;
  type GNotifications = IRaceWithNotificationsObservableNotifications<GObservables>;

  const length: number = observables.length;

  if (length === 0) {
    return emptyWithNotifications();
  } else {
    return (emit: IObserver<GNotifications>): IUnsubscribe => {
      const values: unknown[] = Array.from({ length });

      return futureUnsubscribe((
        unsubscribe: IUnsubscribe,
        running: IRunning,
      ): IUnsubscribe => {
        return mergeUnsubscribeFunctions(
          observables
            .map((subscribe: IGenericObservable, index: number): IUnsubscribe => {
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
                    emit(createErrorNotification(error));
                    unsubscribe();
                  },
                ),
              );
            }),
        );
      });
    };
  }
}
