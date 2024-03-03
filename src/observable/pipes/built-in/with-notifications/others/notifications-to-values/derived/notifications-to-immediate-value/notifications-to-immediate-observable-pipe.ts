import { IDefaultInNotificationsUnion } from '../../../../../../../../misc/notifications/default-notifications-union.type';
import { IObservable } from '../../../../../../../type/observable.type';
import { IObservablePipe } from '../../../../../../type/observable-pipe.type';
import { notificationsToImmediateObservable } from './notifications-to-immediate-observable';
import { INotificationsToImmediateObservableOnErrorFunction } from './notifications-to-immediate-observable-on-error-function.type';

export function notificationsToImmediateObservablePipe<GValue>(
  onError?: INotificationsToImmediateObservableOnErrorFunction,
): IObservablePipe<IDefaultInNotificationsUnion<GValue>, GValue> {
  return (subscribe: IObservable<IDefaultInNotificationsUnion<GValue>>): IObservable<GValue> => {
    return notificationsToImmediateObservable<GValue>(subscribe, onError);
  };
}
