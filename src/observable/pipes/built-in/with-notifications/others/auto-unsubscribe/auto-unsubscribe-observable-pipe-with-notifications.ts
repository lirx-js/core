import { IObservable } from '../../../../../type/observable.type';
import { IObservablePipe } from '../../../../type/observable-pipe.type';
import {
  autoUnsubscribeObservableWithNotifications,
  IAutoUnsubscribeObservableNotifications,
} from './auto-unsubscribe-observable-with-notifications';

/**
 * @experimental
 */
export function autoUnsubscribeObservablePipeWithNotifications<
  GNotifications extends IAutoUnsubscribeObservableNotifications,
>(): IObservablePipe<GNotifications, GNotifications> {
  return (subscribe: IObservable<GNotifications>): IObservable<GNotifications> => {
    return autoUnsubscribeObservableWithNotifications<GNotifications>(subscribe);
  };
}
