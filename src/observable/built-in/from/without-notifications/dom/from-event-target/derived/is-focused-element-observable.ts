import {
  distinctObservable
} from '../../../../../../pipes/built-in/without-notifications/observer-pipe-related/distinct/distinct-observable';
import { mapObservable } from '../../../../../../pipes/built-in/without-notifications/observer-pipe-related/map/map-observable';
import { IObservable } from '../../../../../../type/observable.type';
import { merge } from '../../../many-observables/merge/merge';
import { reference } from '../../../values/reference/reference';
import { fromEventTarget } from '../from-event-target';
import { focusLeaveElementObservable } from './focus-leave-element-observable';

/**
 * @experimental
 */
export function isFocusedElementObservable(
  element: Element,
): IObservable<boolean> {
  return distinctObservable(
    merge([
      reference(() => document.activeElement === element),
      mapObservable<FocusEvent, boolean>(
        fromEventTarget<'focusin', FocusEvent>(element, 'focusin'),
        () => true,
      ),
      mapObservable<FocusEvent, boolean>(
        focusLeaveElementObservable(element),
        () => false,
      ),
    ]),
  );
}
