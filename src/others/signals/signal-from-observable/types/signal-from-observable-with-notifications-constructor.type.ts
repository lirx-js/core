import { IObservable } from '../../../../observable/type/observable.type';
import { ISignalFromObservable } from '../signal-from-observable.type';
import { ISignalFromObservableOptions } from './signal-from-observable-options.type';
import { IDefaultInNotificationsUnion } from '../../../../misc/notifications/default-notifications-union.type';

export interface ISignalFromObservableWithNotificationConstructor {
  new<GValue>(
    value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
    options?: ISignalFromObservableOptions<GValue>,
  ): ISignalFromObservable<GValue>;
}
