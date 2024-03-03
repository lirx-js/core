import { createErrorNotification } from '../../misc/notifications/built-in/error/create-error-notification';
import { createNextNotification } from '../../misc/notifications/built-in/next/create-next-notification';
import { IObservable, IUnsubscribeOfObservable } from '../../observable/type/observable.type';
import { MAP_FILTER_DISCARD } from '../../observer/pipes/built-in/map-filter/map-filter-discard.constant';
import { IMapFilterMapFunctionReturn } from '../../observer/pipes/built-in/map-filter/map-filter-map-function.type';
import { IObserver } from '../../observer/type/observer.type';
import { effect } from '../effect/effect';
import { IReadonlySignal } from '../signal/types/readonly-signal.type';
import { IObservableFromSignalNotifications } from './types/observable-from-signal-notifications.type';
import {
  DEFAULT_OBSERVABLE_FROM_SIGNAL_ON_ERROR_FUNCTION,
  IObservableFromSignalOnErrorFunction,
} from './types/observable-from-signal-on-error-function.type';

export interface IFromSignalOptionsForValueMode<GValue> {
  readonly mode?: 'value';
  readonly onError?: IObservableFromSignalOnErrorFunction<GValue>;
}

export interface IFromSignalOptionsForNotificationMode<GValue> {
  readonly mode: 'notification';
}

export function fromSignal<GValue>(
  signal: IReadonlySignal<GValue>,
  options?: IFromSignalOptionsForValueMode<GValue>,
): IObservable<GValue>;
export function fromSignal<GValue>(
  signal: IReadonlySignal<GValue>,
  options: IFromSignalOptionsForNotificationMode<GValue>,
): IObservable<IObservableFromSignalNotifications<GValue>>;
export function fromSignal<GValue>(
  signal: IReadonlySignal<GValue>,
  options:
    | IFromSignalOptionsForValueMode<GValue>
    | IFromSignalOptionsForNotificationMode<GValue> = {},
): IObservable<GValue> | IObservable<IObservableFromSignalNotifications<GValue>> {
  if (options.mode === 'notification') {
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
  } else {
    const onError: IObservableFromSignalOnErrorFunction<GValue> =
      DEFAULT_OBSERVABLE_FROM_SIGNAL_ON_ERROR_FUNCTION;
    return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
      return effect((): void => {
        let value: IMapFilterMapFunctionReturn<GValue>;

        try {
          value = signal();
        } catch (error: unknown) {
          value = onError(error);
        }

        if (value !== MAP_FILTER_DISCARD) {
          emit(value);
        }
      });
    };
  }
}
