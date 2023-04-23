import { IGenericNotification } from '../../../../../../../../misc/notifications/notification.type';
import { IDragStartNotification } from './drag-start-notification.type';

export function isDragStartNotification<GElement extends Element>(
  notification: IGenericNotification,
): notification is IDragStartNotification<GElement> {
  return (notification.name === 'drag-start');
}
