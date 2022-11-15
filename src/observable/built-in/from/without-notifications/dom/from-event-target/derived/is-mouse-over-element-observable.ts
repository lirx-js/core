import { mapObservable } from '../../../../../../pipes/built-in/without-notifications/observer-pipe-related/map/map-observable';
import { IObservable } from '../../../../../../type/observable.type';
import { merge } from '../../../many-observables/merge/merge';
import { fromSelfEventTarget } from './from-self-event-target';

/**
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

// export function isMouseOverElementObservable(
//   element: Element,
// ): IObservable<boolean> {
//   return merge([
//     mapFilter$$<MouseEvent, boolean>(
//       fromEventTarget<'mouseenter', MouseEvent>(element, 'mouseenter'),
//       (event: MouseEvent): boolean | IMapFilterDiscard => {
//         return (event.currentTarget === event.target)
//           ? true
//           : MAP_FILTER_DISCARD;
//       },
//     ),
//     mapFilter$$<MouseEvent, boolean>(
//       fromEventTarget<'mouseleave', MouseEvent>(element, 'mouseleave'),
//       (event: MouseEvent): boolean | IMapFilterDiscard => {
//         return (event.currentTarget === event.target)
//           ? false
//           : MAP_FILTER_DISCARD;
//       },
//     ),
//   ]);
// }
//
