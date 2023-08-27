import { mapObservable } from '../../../../../../pipes/built-in/without-notifications/observer-pipe-related/map/map-observable';
import { IObservable } from '../../../../../../type/observable.type';
import { merge } from '../../../many-observables/merge/merge';
import { fromSelfEventTarget } from './from-self-event-target';

/**
 * Creates an Observable emitting true when the element has the mouse over, and false when it has not.
 *
 * @experimental
 */
export function isMouseOverElementObservable(
  element: Element,
): IObservable<boolean> {
  return merge([
    mapObservable<MouseEvent, boolean>(
      fromSelfEventTarget<'mouseenter', MouseEvent>(element, 'mouseenter'),
      () => true,
    ),
    mapObservable<MouseEvent, boolean>(
      fromSelfEventTarget<'mouseleave', MouseEvent>(element, 'mouseleave'),
      () => false,
    ),
  ]);
}
