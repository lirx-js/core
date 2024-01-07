import { IObserverObservablePair } from '../../../observer-observable-pair/type/observer-observable-pair.type';
import { IObserver } from '../../../observer/type/observer.type';
import { ISignal } from '../../../signals/signal/signal.type';

export type IObserverLike<GValue> =
  | IObserver<GValue>
  | IObserverObservablePair<GValue, any>
  | ISignal<GValue>
  ;
