import { mapObservable } from '../../../../../pipes/built-in/without-notifications/observer-pipe-related/map/map-observable';
import { IObservable } from '../../../../../type/observable.type';
import { merge } from '../../many-observables/merge/merge';
import { reference } from '../../values/reference/reference';
import { fromEventTarget } from '../from-event-target/from-event-target';

export function fromMatchMedia(query: string): IObservable<boolean> {
  const mediaQueryList: MediaQueryList = matchMedia(query);
  return merge([
    reference(() => mediaQueryList.matches),
    mapObservable<MediaQueryListEvent, boolean>(
      fromEventTarget<'change', MediaQueryListEvent>(mediaQueryList, 'change'),
      (event: MediaQueryListEvent): boolean => event.matches,
    ),
  ]);
}
