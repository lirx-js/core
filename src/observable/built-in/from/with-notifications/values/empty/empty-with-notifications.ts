import { noop } from '@lirx/utils';
import { STATIC_COMPLETE_NOTIFICATION } from '../../../../../../misc/notifications/built-in/complete/complete-notification.constant';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';
import { IEmptyObservableNotifications } from './empty-observable-notifications.type';

export function emptyWithNotifications(): IObservable<IEmptyObservableNotifications> {
  return (emit: IObserver<IEmptyObservableNotifications>): IUnsubscribeOfObservable => {
    emit(STATIC_COMPLETE_NOTIFICATION);
    return noop;
  };
}
