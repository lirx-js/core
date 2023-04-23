import { INotification } from '../../../../../../../../misc/notifications/notification.type';
import { IDraggableElementObject } from '../../create-draggable-observable';

export type IDragStartNotification<GElement extends Element> = INotification<'drag-start', IDraggableElementObject<GElement>>;

