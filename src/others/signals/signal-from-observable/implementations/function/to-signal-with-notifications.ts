import { IObservable } from '../../../../../observable/type/observable.type';
import { ISignalFromObservable } from '../../signal-from-observable.type';
import { ISignalFromObservableOptions } from '../../types/signal-from-observable-options.type';
import { IDefaultInNotificationsUnion } from '../../../../../misc/notifications/default-notifications-union.type';
import { SignalFromObservableWithNotifications } from '../class/signal-from-observable-with-notifications.class';

export function toSignalWithNotifications<GValue>(
  value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
): ISignalFromObservable<GValue>;
export function toSignalWithNotifications<GValue, GInitialValue extends (GValue | null | undefined)>(
  value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
  options: ISignalFromObservableOptions<GInitialValue>,
): ISignalFromObservable<GValue | GInitialValue>;
export function toSignalWithNotifications<GValue>(
  value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
  options?: ISignalFromObservableOptions<any>,
): ISignalFromObservable<GValue> {
  return new SignalFromObservableWithNotifications<GValue>(
    value$,
    options,
  );
}
