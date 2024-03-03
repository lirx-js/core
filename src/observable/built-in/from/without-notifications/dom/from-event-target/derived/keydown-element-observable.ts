import { filterObservable } from '../../../../../../pipes/built-in/without-notifications/observer-pipe-related/filter/filter-observable';
import { IObservable } from '../../../../../../type/observable.type';

// export function isFocusedElementObservable(
//   element: Element,
// ): IObservable<boolean> {
//   return mapFilter$$(fromEventTarget<'keydown', KeyboardEvent>(element, 'keydown'), (event: KeyboardEvent): IMapFilterMapFunctionReturn<IMatMenuComponentUserCloseType> => {
//     return (event.key === 'Escape')
//       ? 'escape'
//       : MAP_FILTER_DISCARD;
//   });
// }

/**
 * Creates an Observable emitting a KeyboardEvent when a 'keydown' appends with a specific key.
 *
 * @experimental
 */
export function filterKeyObservable(
  onKeyDown$: IObservable<KeyboardEvent>,
  key: string,
): IObservable<KeyboardEvent> {
  return filterObservable(onKeyDown$, (event: KeyboardEvent): boolean => {
    return event.key === key;
  });
}
