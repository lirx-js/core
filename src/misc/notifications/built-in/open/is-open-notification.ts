import { isNotification } from '../../is-notification';
import { OPEN_NOTIFICATION_NAME } from './open-notification-name.constant';
import { IOpenNotification } from './open-notification.type';

export function isOpenNotification<GValue>(value: any): value is IOpenNotification<GValue> {
  return isNotification<'open', GValue>(value, OPEN_NOTIFICATION_NAME);
}
