import { noop } from '@lirx/utils';
import { STATIC_COMPLETE_NOTIFICATION } from '../../../../../../misc/notifications/built-in/complete/complete-notification.constant';
import { createNextNotification } from '../../../../../../misc/notifications/built-in/next/create-next-notification';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';
import { ISingleObservableNotifications } from './single-observable-notifications.type';

export function singleWithNotifications<GValue>(
  value: GValue,
): IObservable<ISingleObservableNotifications<GValue>> {
  return (emit: IObserver<ISingleObservableNotifications<GValue>>): IUnsubscribeOfObservable => {
    emit(createNextNotification<GValue>(value));
    emit(STATIC_COMPLETE_NOTIFICATION);
    return noop;
  };
}
