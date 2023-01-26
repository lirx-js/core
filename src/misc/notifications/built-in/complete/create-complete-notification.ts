import { createNotification } from '../../create-notification';
import { COMPLETE_NOTIFICATION_NAME } from './complete-notification-name.constant';
import { ICompleteNotification } from './complete-notification.type';

export function createCompleteNotification(): ICompleteNotification {
  return createNotification<'complete', void>(COMPLETE_NOTIFICATION_NAME, void 0);
}
