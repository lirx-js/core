import { futureUnsubscribe } from '@lirx/utils';
import { defaultNotificationObserver } from '../../../../misc/notifications/default-notification-observer';
import { IDefaultInNotificationsUnion } from '../../../../misc/notifications/default-notifications-union.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../observable/type/observable.type';
import { SignalClass } from '../../internal/signal.class';
import { ISignalToObservableOptions } from '../../signal/signal-to-observable-options.type';
import { SIGNAL } from '../../signal/signal.symbol';
import { ISignalFromObservable } from './signal-from-observable.type';
import { IToSignalOptions } from './to-signal-options.type';

export function toSignalWithNotifications<GValue>(
  value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
): ISignalFromObservable<GValue>;
export function toSignalWithNotifications<GValue, GInitialValue extends (GValue | null | undefined)>(
  value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
  options: IToSignalOptions<GInitialValue>,
): ISignalFromObservable<GValue | GInitialValue>;
export function toSignalWithNotifications<GValue>(
  value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
  options?: IToSignalOptions<any>,
): ISignalFromObservable<GValue> {
  const _signal = new SignalClass<GValue>(
    (options === void 0)
      ? (void 0 as GValue)
      : options.initialValue,
  );

  let _active: boolean = false;
  let _unsubscribe: IUnsubscribeOfObservable;
  let _awaitingValue: boolean = true;
  let _errored: boolean = false;
  let _error: unknown;

  const newSignal: ISignalFromObservable<GValue> = ((): GValue => {
    if (_errored) {
      throw _error;
    } else {
      return _signal.get();
    }
  }) as ISignalFromObservable<GValue>;

  newSignal.toObservable = (
    options?: ISignalToObservableOptions,
  ): IObservable<GValue> => {
    return _signal.toObservable(options);
  };

  newSignal.isActive = (): boolean => {
    return _active;
  };

  newSignal.activate = (
    active: boolean = true,
  ): ISignalFromObservable<GValue> => {
    if (active !== _active) {
      _active = active;
      if (active) {
        _unsubscribe = futureUnsubscribe((
          unsubscribe: IUnsubscribeOfObservable,
        ): IUnsubscribeOfObservable => {
          return value$(
            defaultNotificationObserver<GValue>(
              /* next */(value: GValue): void => {
                if (_awaitingValue) {
                  _awaitingValue = false;
                }
                _signal.set(value);
              },
              /* complete */(): void => {
                unsubscribe();
              },
              /* error */(error: unknown): void => {
                unsubscribe();
                _errored = true;
                _error = error;
              },
            ),
          );
        });
      } else {
        _unsubscribe();
      }
    }

    return newSignal;
  };

  newSignal[SIGNAL] = void 0;

  newSignal.activate();

  if (
    (options === void 0)
    && _awaitingValue
  ) {
    _unsubscribe!();
    throw new Error(`Provided Observable is not sync`);
  }

  return newSignal;
}
