import { IObservable } from '../../observable/type/observable.type';
import { IObserver } from '../../observer/type/observer.type';

export type IObserverObservableTuple<GValue> = [
  emit: IObserver<GValue>,
  subscribe: IObservable<GValue>,
];

/* derived */

export type IGenericObserverObservableTuple = IObserverObservableTuple<any>;

export type IInferObserverObservableTupleGValue<
  GObserverObservableTuple extends IGenericObserverObservableTuple,
> = GObserverObservableTuple extends IObserverObservableTuple<infer GValue> ? GValue : never;
