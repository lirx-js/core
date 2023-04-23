import { filterObservable } from '../../../../../../pipes/built-in/without-notifications/observer-pipe-related/filter/filter-observable';
import { IObservable } from '../../../../../../type/observable.type';
import { fromEventTarget } from '../from-event-target';

/**
 * Creates an Observable emitting a FocusEvent when a 'focusout' appends outside the element.
 *
 * @experimental
 */
export function focusLeaveElementObservable(
  element: Element,
): IObservable<FocusEvent> {
  return filterObservable(
    fromEventTarget<'focusout', FocusEvent>(element, 'focusout'),
    (event: FocusEvent): boolean => {
      return (
        (event.relatedTarget === null)
        || !element.contains(event.relatedTarget as Node)
      );
    },
  );
}
