import { IObservable } from '../../../observable/type/observable.type';
import { IObserverObservablePair } from '../../../observer-observable-pair/type/observer-observable-pair.type';
import { IReadonlySignal } from '../../../signals/signal/types/readonly-signal.type';

export type IObservableLike<GValue> =
  | GValue
  | IObservable<GValue>
  | IObserverObservablePair<any, GValue>
  | IReadonlySignal<GValue>;
