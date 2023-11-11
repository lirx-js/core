import { ISignalToValueObservableOptions, ISignalToNotificationsObservableOptions } from './signal-to-observable-options.type';
import { IObservable } from '../../../../../observable/type/observable.type';
import { ISignalNotifications } from '../../../signal/types/signal-notifications.type';

export interface IReadonlySignalToObservableFunction<GValue> {
  (
    options?: ISignalToValueObservableOptions<GValue>,
  ): IObservable<GValue>;

  (
    options: ISignalToNotificationsObservableOptions,
  ): IObservable<ISignalNotifications<GValue>>;
}
