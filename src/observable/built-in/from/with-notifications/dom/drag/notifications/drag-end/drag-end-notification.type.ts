import { INotification } from '../../../../../../../../misc/notifications/notification.type';
import { IDraggableElementObject } from '../../create-draggable-observable';

export type IDragEndNotification<GElement extends Element> = INotification<
  'drag-end',
  IDraggableElementObject<GElement>
>;
