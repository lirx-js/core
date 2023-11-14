import { IObservable } from '../../../../../observable/type/observable.type';
import { ISignalFromObservable } from '../../signal-from-observable.type';
import {
  ISignalFromObservableOptions,
  ISignalFromValueObservableOptions,
  ISignalFromNotificationsObservableOptions,
} from '../../types/signal-from-observable-options.type';
import { SignalFromObservable } from '../class/signal-from-observable.class';
import { IDefaultInNotificationsUnion } from '../../../../../misc/notifications/default-notifications-union.type';

export function toSignal<GValue>(
  value$: IObservable<GValue>,
  options?: ISignalFromValueObservableOptions<GValue>
): ISignalFromObservable<GValue>;
export function toSignal<GValue>(
  value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
  options: ISignalFromNotificationsObservableOptions<GValue>,
): ISignalFromObservable<GValue>;
export function toSignal<GValue>(
  value$: IObservable<GValue> | IObservable<IDefaultInNotificationsUnion<GValue>>,
  options?: ISignalFromObservableOptions<GValue> | ISignalFromNotificationsObservableOptions<GValue>,
): ISignalFromObservable<GValue> {
  return new SignalFromObservable<GValue>(
    value$ as any,
    options,
  );
}
