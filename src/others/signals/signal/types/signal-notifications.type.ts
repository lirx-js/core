import { INextNotification } from '../../../../misc/notifications/built-in/next/next-notification.type';
import { IErrorNotification } from '../../../../misc/notifications/built-in/error/error-notification.type';

export type ISignalNotifications<GValue> =
  | INextNotification<GValue>
  | IErrorNotification
  ;
