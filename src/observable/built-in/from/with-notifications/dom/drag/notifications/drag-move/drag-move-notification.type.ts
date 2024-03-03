import { INotification } from '../../../../../../../../misc/notifications/notification.type';
import { IDraggableElementObject } from '../../create-draggable-observable';

export type IDragMoveNotification<GElement extends Element> = INotification<
  'drag-move',
  IDraggableElementObject<GElement>
>;
