import { IMapFunction } from '../../../../../../../../observer/pipes/built-in/map/map-function.type';
import { IObserver } from '../../../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribe } from '../../../../../../../type/observable.type';
import { mapObservable } from '../../../../observer-pipe-related/map/map-observable';
import { mergeAllSingleObservable } from '../../../merge-all/derived/merge-all-single/merge-all-single-observable';

export function mergeMapSingleObservable<GIn, GOut>(
  subscribe: IObservable<GIn>,
  mapFunction: IMapFunction<GIn, IObservable<GOut>>,
): IObservable<GOut> {
  return (emit: IObserver<GOut>): IUnsubscribe => {
    let running: boolean = true;
    let childUnsubscribeFunction: IUnsubscribe;

    const unsubscribeChild = (): void => {
      if (childUnsubscribeFunction !== void 0) {
        childUnsubscribeFunction();
      }
    };

    const unsubscribe = subscribe((value: GIn): void => {
      unsubscribeChild();
      childUnsubscribeFunction = mapFunction(value)(emit);
    });

    return (): void => {
      if (running) {
        running = false;
        unsubscribe();
        unsubscribeChild();
      }
    };
  };
  // return mergeAllSingleObservable<GOut>(
  //   mapObservable<GIn, IObservable<GOut>>(
  //     subscribe,
  //     mapFunction,
  //   ),
  // );
  // return pipeObservable(subscribe, [
  //   mapObservablePipe<GIn, IObservable<GOut>>(mapFunction),
  //   mergeAllSingleObservablePipe<GOut>(),
  // ]);
}
