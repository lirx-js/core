import { createNotification } from '../../../../../../misc/notifications/create-notification';
import { TInferNotificationGName } from '../../../../../../misc/notifications/notification.type';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';
import { fromEventTarget } from '../../../without-notifications/dom/from-event-target/from-event-target';
import { IDragEndNotification } from './notifications/drag-end/drag-end-notification.type';
import { IDragMoveNotification } from './notifications/drag-move/drag-move-notification.type';
import { IDragStartNotification } from './notifications/drag-start/drag-start-notification.type';
import { createPoint2D, IPoint2D } from './point-2d';

export interface IDraggableObject {
  readonly origin: IPoint2D;
  readonly delta: IPoint2D;
}

export interface IDraggableElementObject<GElement extends Element> extends IDraggableObject {
  readonly element: GElement;
}

export type IDraggableObservableNotifications<GElement extends Element> =
  | IDragStartNotification<GElement>
  | IDragMoveNotification<GElement>
  | IDragEndNotification<GElement>
  ;

/*---------------*/

export function createDraggableObservable<GElement extends Element>(
  element: Element,
): IObservable<IDraggableObservableNotifications<GElement>> {
  return (emit: IObserver<IDraggableObservableNotifications<GElement>>): IUnsubscribeOfObservable => {
    let origin: IPoint2D;
    let unsubscribeOfPointerDown: IUnsubscribeOfObservable;
    let unsubscribeOfPointerMove: IUnsubscribeOfObservable;
    let unsubscribeOfPointerUp: IUnsubscribeOfObservable;

    const dispatch = (
      name: TInferNotificationGName<IDraggableObservableNotifications<GElement>>,
      event: PointerEvent,
    ): void => {
      emit(createNotification(name, {
        element,
        origin,
        delta: createPoint2D(
          event.clientX - origin.x,
          event.clientY - origin.y,
        ),
      }) as IDraggableObservableNotifications<GElement>);
    };

    const subscribeToPointerDown = (): void => {
      unsubscribeOfPointerDown = pointerDown$(onPointerDown);
    };

    const preventDefault = (event: PointerEvent): void => {
      event.stopImmediatePropagation();
      event.preventDefault();
    };

    const onPointerDown = (event: PointerEvent): void => {
      unsubscribeOfPointerDown();
      preventDefault(event);
      origin = createPoint2D(event.clientX, event.clientY);
      dispatch('drag-start', event);
      dispatch('drag-move', event);
      unsubscribeOfPointerMove = pointerMove$(onPointerMove);
      unsubscribeOfPointerUp = pointerUp$(onPointerUp);
    };

    const onPointerMove = (event: PointerEvent): void => {
      preventDefault(event);
      dispatch('drag-move', event);
    };

    const onPointerUp = (event: PointerEvent): void => {
      preventDefault(event);
      dispatch('drag-move', event);
      dispatch('drag-end', event);
      unsubscribeOfPointerMove();
      unsubscribeOfPointerUp();
      subscribeToPointerDown();
    };

    const pointerDown$ = fromEventTarget<'pointerdown', PointerEvent>(element, 'pointerdown');
    const pointerMove$ = fromEventTarget<'pointermove', PointerEvent>(window, 'pointermove');
    const pointerUp$ = fromEventTarget<'pointerup', PointerEvent>(window, 'pointerup');

    subscribeToPointerDown();

    return (): void => {
      unsubscribeOfPointerDown();
      unsubscribeOfPointerMove();
      unsubscribeOfPointerUp();
    };
  };
}


