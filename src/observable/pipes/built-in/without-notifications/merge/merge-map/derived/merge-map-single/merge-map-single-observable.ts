import { IMapFunction } from '../../../../../../../../observer/pipes/built-in/map/map-function.type';
import { IObservable } from '../../../../../../../type/observable.type';
import { mapObservable } from '../../../../observer-pipe-related/map/map-observable';
import { mergeAllSingleObservable } from '../../../merge-all/derived/merge-all-single/merge-all-single-observable';

export function mergeMapSingleObservable<GIn, GOut>(
  subscribe: IObservable<GIn>,
  mapFunction: IMapFunction<GIn, IObservable<GOut>>,
): IObservable<GOut> {
  return mergeAllSingleObservable<GOut>(
    mapObservable<GIn, IObservable<GOut>>(
      subscribe,
      mapFunction,
    ),
  );
  // return pipeObservable(subscribe, [
  //   mapObservablePipe<GIn, IObservable<GOut>>(mapFunction),
  //   mergeAllSingleObservablePipe<GOut>(),
  // ]);
}
