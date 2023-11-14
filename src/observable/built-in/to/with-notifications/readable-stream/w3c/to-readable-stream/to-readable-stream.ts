import { defaultNotificationObserver } from '../../../../../../../misc/notifications/default-notification-observer';
import { IDefaultNotificationsUnion } from '../../../../../../../misc/notifications/default-notifications-union.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../../type/observable.type';
import { futureUnsubscribe } from '@lirx/unsubscribe';

export function toReadableStream<GValue>(
  subscribe: IObservable<IDefaultNotificationsUnion<GValue>>,
): ReadableStream<GValue> {
  let unsubscribe: IUnsubscribeOfObservable;
  return new ReadableStream<GValue>({
    start: (
      controller: ReadableStreamDefaultController<GValue>,
    ): void => {
      unsubscribe = futureUnsubscribe((
        unsubscribe: IUnsubscribeOfObservable,
      ): IUnsubscribeOfObservable => {
        return subscribe(
          defaultNotificationObserver<GValue>(
            /* next */(value: GValue): void => {
              controller.enqueue(value);
            },
            /* complete */(): void => {
              controller.close();
              unsubscribe();
            },
            /* error */(error: unknown): void => {
              controller.error(error);
              unsubscribe();
            },
          ),
        );
      });
    },
    cancel: (): void => {
      unsubscribe();
    },
  });
}

