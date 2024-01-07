import { IObservable } from '../../../observable/type/observable.type';
import { IObserverObservablePair } from '../../../observer-observable-pair/type/observer-observable-pair.type';
import { IReadonlySignal } from '../../../signals/readonly-signal/readonly-signal.type';

export type IObservableLike<GValue> =
  | GValue
  | IObservable<GValue>
  | IObserverObservablePair<any, GValue>
  | IReadonlySignal<GValue>
  ;
