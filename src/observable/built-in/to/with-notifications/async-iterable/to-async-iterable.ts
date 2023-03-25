import { IDefaultInNotificationsUnion } from '../../../../../misc/notifications/default-notifications-union.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../type/observable.type';
import { IObservableToPromiseNotifications } from '../promise/all/to-promise-all';

function createDeferredPromise(): { promise: Promise<void>; resolve: () => void } {
  let resolve!: () => void;

  const promise = new Promise<void>((_resolve: () => void): void => {
    resolve = _resolve;
  });

  return {
    promise,
    resolve,
  };
}

export type IObservableToAsyncGeneratorNotifications<GValue> = IDefaultInNotificationsUnion<GValue>;

export async function* toAsyncIterable<GValue>(
  subscribe: IObservable<IObservableToAsyncGeneratorNotifications<GValue>>,
): AsyncGenerator<GValue> {
  const notifications: IObservableToPromiseNotifications<GValue>[] = [];



  let notificationPromise = createDeferredPromise();

  const unsubscribe: IUnsubscribeOfObservable = subscribe((notification: IObservableToPromiseNotifications<GValue>): void => {
    notifications.push(notification);
    notificationPromise.resolve();
  });

  try {
    while (true) {
      await notificationPromise.promise;
      notificationPromise = createDeferredPromise();

      while (notifications.length > 0) {
        const notification: IObservableToPromiseNotifications<GValue> = notifications.shift() as IObservableToPromiseNotifications<GValue>;
        switch (notification.name) {
          case 'next':
            yield notification.value;
            break;
          case 'complete':
            return;
          case 'error':
            throw notification.value;
        }
      }
    }
  } finally {
    unsubscribe();
  }
}

