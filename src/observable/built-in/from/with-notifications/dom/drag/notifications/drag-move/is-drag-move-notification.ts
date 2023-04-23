import { IGenericNotification } from '../../../../../../../../misc/notifications/notification.type';
import { IDragMoveNotification } from './drag-move-notification.type';

export function isDragMoveNotification<GElement extends Element>(
  notification: IGenericNotification,
): notification is IDragMoveNotification<GElement> {
  return (notification.name === 'drag-move');
}
