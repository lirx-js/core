import { IMapFunction } from '../../../../../../observer/pipes/built-in/map/map-function.type';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export function mapDistinctObservable<GIn, GOut>(
  subscribe: IObservable<GIn>,
  mapFunction: IMapFunction<GIn, GOut>,
): IObservable<GOut> {
  return (emit: IObserver<GOut>): IUnsubscribeOfObservable => {
    let previousValue: GOut;
    return subscribe((value: GIn): void => {
      // INFO should support a running variable because the `mapFunction` could call `unsubscribe` ?
      const _value: GOut = mapFunction(value);
      if (_value !== previousValue) {
        previousValue = _value;
        emit(_value);
      }
    });
  };
}
