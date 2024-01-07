import { createErrorNotification } from '../../../misc/notifications/built-in/error/create-error-notification';
import { createNextNotification } from '../../../misc/notifications/built-in/next/create-next-notification';
import { IObservable, IUnsubscribeOfObservable } from '../../../observable/type/observable.type';
import { IObserver } from '../../../observer/type/observer.type';
import { effect } from '../../effect/effect';
import { IReadonlySignal } from '../../readonly-signal/readonly-signal.type';
import { IObservableFromSignalNotifications } from './observable-from-signal-notifications.type';

export function fromSignalWithNotifications<GValue>(
  signal: IReadonlySignal<GValue>,
): IObservable<IObservableFromSignalNotifications<GValue>> {
  return (
    emit: IObserver<IObservableFromSignalNotifications<GValue>>,
  ): IUnsubscribeOfObservable => {
    return effect((): void => {
      let value: IObservableFromSignalNotifications<GValue>;

      try {
        value = createNextNotification<GValue>(signal());
      } catch (error: unknown) {
        value = createErrorNotification(error);
      }

      emit(value);
    });
  };
}

