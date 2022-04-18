import { IMapFunction } from '../../../../../../observer/pipes/built-in/map/map-function.type';
import { IObservable } from '../../../../../type/observable.type';
import { mapObservable } from '../../observer-pipe-related/map/map-observable';
import { mergeAllObservable } from '../merge-all/merge-all-observable';

export function mergeMapObservable<GIn, GOut>(
  subscribe: IObservable<GIn>,
  mapFunction: IMapFunction<GIn, IObservable<GOut>>,
  maxNumberOfSubscriptions?: number,
): IObservable<GOut> {
  return mergeAllObservable<GOut>(
    mapObservable<GIn, IObservable<GOut>>(
      subscribe,
      mapFunction,
    ),
    maxNumberOfSubscriptions,
  );
  // return pipeObservable(subscribe, [
  //   mapObservablePipe<GIn, IObservable<GOut>>(mapFunction),
  //   mergeAllObservablePipe<GOut>(maxNumberOfSubscriptions),
  // ]);
}
