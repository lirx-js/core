import { createNotification } from '../../../../../../misc/notifications/create-notification';
import { INotification, TInferNotificationGName } from '../../../../../../misc/notifications/notification.type';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';
import { fromEventTarget } from '../../../without-notifications/dom/from-event-target/from-event-target';
import { createPoint2D, IPoint2D } from './point-2d';

export interface IDraggableObject {
  readonly origin: IPoint2D;
  readonly delta: IPoint2D;
}

export type IDraggableObservableNotifications =
  | INotification<'drag-start', IDraggableObject>
  | INotification<'drag-move', IDraggableObject>
  | INotification<'drag-end', IDraggableObject>
  ;

/*---------------*/


export function createDraggableObservable(
  target: Element,
): IObservable<IDraggableObservableNotifications> {
  return (emit: IObserver<IDraggableObservableNotifications>): IUnsubscribeOfObservable => {
    let origin: IPoint2D;
    let unsubscribeOfMouseDown: IUnsubscribeOfObservable;
    let unsubscribeOfMouseMove: IUnsubscribeOfObservable;
    let unsubscribeOfMouseUp: IUnsubscribeOfObservable;

    const dispatch = (
      name: TInferNotificationGName<IDraggableObservableNotifications>,
      event: MouseEvent,
    ): void => {
      emit(createNotification(name, {
        origin,
        delta: createPoint2D(
          event.clientX - origin.x,
          event.clientY - origin.y
        )
      }) as IDraggableObservableNotifications);
    };

    const onMouseDown = (event: MouseEvent) => {
      event.stopImmediatePropagation();
      event.preventDefault();
      origin = createPoint2D(event.clientX, event.clientY);
      dispatch('drag-start', event);
      dispatch('drag-move', event);
      unsubscribeOfMouseMove = mouseMove$(onMouseMove);
      unsubscribeOfMouseUp = mouseUp$(onMouseUp);
    };

    const onMouseMove = (event: MouseEvent) => {
      event.stopImmediatePropagation();
      event.preventDefault();
      dispatch('drag-move', event);
    };

    const onMouseUp = (event: MouseEvent) => {
      event.stopImmediatePropagation();
      event.preventDefault();
      dispatch('drag-move', event);
      dispatch('drag-end', event);
      unsubscribeOfMouseMove();
      unsubscribeOfMouseUp();
    };

    const mouseDown$ = fromEventTarget<'mousedown', MouseEvent>(target, 'mousedown');
    const mouseMove$ = fromEventTarget<'mousemove', MouseEvent>(window, 'mousemove');
    const mouseUp$ = fromEventTarget<'mouseup', MouseEvent>(window, 'mouseup');

    unsubscribeOfMouseDown = mouseDown$(onMouseDown);

    return (): void => {
      unsubscribeOfMouseDown();
      unsubscribeOfMouseMove();
      unsubscribeOfMouseUp();
    };
  };
}


