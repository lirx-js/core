import { futureUnsubscribe, IRunning } from '../../../../../../misc/helpers/subscription/future-unsubscribe';
import { mergeUnsubscribeFunctions } from '../../../../../../misc/helpers/subscription/merge-unsubscribe-functions';
import { STATIC_COMPLETE_NOTIFICATION } from '../../../../../../misc/notifications/built-in/complete/complete-notification.constant';
import { createErrorNotification } from '../../../../../../misc/notifications/built-in/error/create-error-notification';
import { createNextNotification } from '../../../../../../misc/notifications/built-in/next/create-next-notification';
import { defaultNotificationObserver } from '../../../../../../misc/notifications/default-notification-observer';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IGenericObservable, IObservable, IUnsubscribe } from '../../../../../type/observable.type';
import { singleWithNotifications } from '../../values/single/single-with-notifications';
import {
  IForkJoinObservableNotifications,
  IForkJoinObservablesValues,
  IGenericForkInObservables,
} from './fork-join-observable-notifications.type';

export function forkJoin<GObservables extends IGenericForkInObservables>(
  observables: GObservables,
): IObservable<IForkJoinObservableNotifications<GObservables>> {
  type GValues = IForkJoinObservablesValues<GObservables>;
  type GNotifications = IForkJoinObservableNotifications<GObservables>;

  const length: number = observables.length;

  if (length === 0) {
    return singleWithNotifications<GValues>([] as unknown as GValues);
  } else {
    return (emit: IObserver<GNotifications>): IUnsubscribe => {
      const values: unknown[] = Array.from({ length });
      const completed: boolean[] = Array.from({ length });
      let completeCount: number = 0;

      return futureUnsubscribe((
        unsubscribe: IUnsubscribe,
        running: IRunning,
      ): IUnsubscribe => {
        return mergeUnsubscribeFunctions(
          observables
            .map((subscribe: IGenericObservable, index: number): IUnsubscribe => {
              return futureUnsubscribe((
                localUnsubscribe: IUnsubscribe,
              ): IUnsubscribe => {
                return subscribe(
                  defaultNotificationObserver<GValues>(
                    /* next */(value: GValues): void => {
                      values[index] = value;
                    },
                    /* complete */(): void => {
                      if (!completed[index]) {
                        completed[index] = true;
                        completeCount++;
                      }
                      if (completeCount === length) {
                        emit(createNextNotification<GValues>(values as unknown as GValues));
                        if (running()) {
                          emit(STATIC_COMPLETE_NOTIFICATION);
                        }
                        unsubscribe();
                      } else {
                        localUnsubscribe();
                      }
                    },
                    /* error */(error: unknown): void => {
                      emit(createErrorNotification(error));
                      unsubscribe();
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

