import { IMapFunction } from '../../../../../../../../observer/pipes/built-in/map/map-function.type';
import { IObserver } from '../../../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../../../type/observable.type';

export function mergeMapSingleObservable<GIn, GOut>(
  subscribe: IObservable<GIn>,
  mapFunction: IMapFunction<GIn, IObservable<GOut>>,
): IObservable<GOut> {
  return (emit: IObserver<GOut>): IUnsubscribeOfObservable => {
    let running: boolean = true;
    let childUnsubscribeFunction: IUnsubscribeOfObservable;

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
