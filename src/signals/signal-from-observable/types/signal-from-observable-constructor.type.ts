import { IDefaultInNotificationsUnion } from '../../../misc/notifications/default-notifications-union.type';
import { IObservable } from '../../../observable/type/observable.type';
import { ISignalFromObservable } from '../signal-from-observable.type';
import { ISignalFromNotificationsObservableOptions, ISignalFromObservableOptions } from './signal-from-observable-options.type';

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
