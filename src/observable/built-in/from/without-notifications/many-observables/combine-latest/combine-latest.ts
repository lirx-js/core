import { IObserver } from '../../../../../../observer/type/observer.type';
import { IMapObservableTupleToValueTuple } from '../../../../../type/helpers/map-observable-tuple-to-value-tuple.type';
import {
  IGenericObservable,
  IObservable,
  IUnsubscribeOfObservable,
} from '../../../../../type/observable.type';
import { single } from '../../values/single/single';

export type ICombineLatestObservablesValues<GObservables extends readonly IGenericObservable[]> =
  Readonly<IMapObservableTupleToValueTuple<GObservables>>;

/**
 * Combines multiple Observables to create an Observable whose values are calculated from the latest values of each of its input Observables.
 * INFO: provided 'observables' array MUST not change.
 * INFO: received arrays are readonly.
 */
export function combineLatest<GObservables extends readonly IGenericObservable[]>(
  observables: GObservables,
): IObservable<ICombineLatestObservablesValues<GObservables>> {
  type GValue = ICombineLatestObservablesValues<GObservables>;
  const length: number = observables.length;
  if (length === 0) {
    return single<GValue>([] as unknown as GValue);
  } else {
    return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
      const values: unknown[] = Array.from({ length });
      const received: boolean[] = Array.from({ length });
      let receivedCount: number = 0;
      const unsubscribe: IUnsubscribeOfObservable[] = observables.map(
        (subscribe: IGenericObservable, index: number): IUnsubscribeOfObservable => {
          return subscribe((value: GValue): void => {
            values[index] = value;
            if (!received[index]) {
              received[index] = true;
              receivedCount++;
            }
            if (receivedCount === length) {
              emit(values as unknown as GValue);
            }
          });
        },
      );
      return (): void => {
        for (let i = 0, l = unsubscribe.length; i < l; i++) {
          unsubscribe[i]();
        }
      };
    };
  }
}
