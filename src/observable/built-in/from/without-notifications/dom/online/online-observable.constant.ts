import { mapDistinctObservable } from '../../../../../pipes/built-in/without-notifications/observer-pipe-related/map-distinct/map-distinct-observable';
import { merge } from '../../many-observables/merge/merge';
import { single } from '../../values/single/single';
import { fromEventTarget } from '../from-event-target/from-event-target';

export const ONLINE_OBSERVABLE = mapDistinctObservable(
  merge([single(void 0), fromEventTarget(window, 'online'), fromEventTarget(window, 'offline')]),
  (): boolean => window.navigator.onLine,
);
