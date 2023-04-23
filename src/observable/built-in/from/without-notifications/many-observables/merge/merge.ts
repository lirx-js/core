import { TupleTypes } from '@lirx/utils';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IGenericObservable, IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export type IMergeObservablesValues<GObservables extends readonly IGenericObservable[]> = TupleTypes<{
  [GKey in keyof GObservables]: GObservables[GKey] extends IObservable<infer GValue>
    ? GValue
    : never;
}>;

/**
 * Creates an Observable which concurrently emits all values from every given input Observables.
 */
export function merge<GObservables extends readonly IGenericObservable[]>(
  observables: GObservables,
): IObservable<IMergeObservablesValues<GObservables>> {
  type GValue = IMergeObservablesValues<GObservables>;
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    const unsubscribe: IUnsubscribeOfObservable[] = observables
      .map((subscribe: IGenericObservable): IUnsubscribeOfObservable => {
        return subscribe(emit);
      });
    return (): void => {
      for (let i = 0, l = unsubscribe.length; i < l; i++) {
        unsubscribe[i]();
      }
    };
  };
}

export function mergeSpread<GObservables extends readonly IGenericObservable[]>(
  ...observables: GObservables
): IObservable<IMergeObservablesValues<GObservables>> {
  return merge<GObservables>(observables);
}
