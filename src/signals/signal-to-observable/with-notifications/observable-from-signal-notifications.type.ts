import { IErrorNotification } from '../../../misc/notifications/built-in/error/error-notification.type';
import { INextNotification } from '../../../misc/notifications/built-in/next/next-notification.type';

export type IObservableFromSignalNotifications<GValue> =
  | INextNotification<GValue>
  | IErrorNotification
  ;
