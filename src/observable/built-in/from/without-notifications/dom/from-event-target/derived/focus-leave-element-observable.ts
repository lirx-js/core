import { MAP_FILTER_DISCARD } from '../../../../../../../observer/pipes/built-in/map-filter/map-filter-discard.constant';
import { IMapFilterMapFunctionReturn } from '../../../../../../../observer/pipes/built-in/map-filter/map-filter-map-function.type';
import {
  mapFilterObservable
} from '../../../../../../pipes/built-in/without-notifications/observer-pipe-related/map-filter/map-filter-observable';
import { IObservable } from '../../../../../../type/observable.type';
import { fromEventTarget } from '../from-event-target';

/**
 * @experimental
 */
export function focusLeaveElementObservable(
  element: Element,
): IObservable<FocusEvent> {
  return mapFilterObservable(
    fromEventTarget<'focusout', FocusEvent>(element, 'focusout'),
    (event: FocusEvent): IMapFilterMapFunctionReturn<FocusEvent> => {
      return (
        (event.relatedTarget === null)
        || !element.contains(event.relatedTarget as Node)
      )
        ? event
        : MAP_FILTER_DISCARD;
    },
  );
}
