import { IObservable } from '../../../../observable/type/observable.type';
import { ISignalFromObservable } from '../signal-from-observable.type';
import { ISignalFromObservableOptions, ISignalFromNotificationsObservableOptions } from './signal-from-observable-options.type';
import { IDefaultInNotificationsUnion } from '../../../../misc/notifications/default-notifications-union.type';

export interface ISignalFromObservableConstructor {
  new<GValue>(
    value$: IObservable<GValue>,
    options?: ISignalFromObservableOptions<GValue>,
  ): ISignalFromObservable<GValue>;

  new<GValue>(
    value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
    options: ISignalFromNotificationsObservableOptions<GValue>,
  ): ISignalFromObservable<GValue>;
}
