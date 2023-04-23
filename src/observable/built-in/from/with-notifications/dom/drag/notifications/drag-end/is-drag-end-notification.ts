import { IGenericNotification } from '../../../../../../../../misc/notifications/notification.type';
import { IDragEndNotification } from './drag-end-notification.type';

export function isDragEndNotification<GElement extends Element>(
  notification: IGenericNotification,
): notification is IDragEndNotification<GElement> {
  return (notification.name === 'drag-end');
}
