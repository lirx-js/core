import { createEventListener, IEventListenerFromEventMap, IReadonlyEventTarget } from '@lirx/utils';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

/**
 * Creates an Observable which emits events dispatched by 'target'
 */
export function fromEventTarget<GType extends string, GEvent extends Event>(
  target: IReadonlyEventTarget<Record<GType, GEvent>>,
  type: GType,
  options?: boolean | AddEventListenerOptions,
): IObservable<GEvent> {
  return (emit: IObserver<GEvent>): IUnsubscribeOfObservable => {
    return createEventListener<GType, GEvent>(
      target,
      type,
      emit as IEventListenerFromEventMap<Record<GType, GEvent>, GType>,
      options,
    );
  };
}
