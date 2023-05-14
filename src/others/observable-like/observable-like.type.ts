import { IGenericObservable, IObservable } from '../../observable/type/observable.type';
import { ISignal } from '../signals/signal/signal.type';

export type INotAnObservable<GValue> = [GValue] extends [IGenericObservable]
  ? { MUST_NOT_BE_AN_OBSERVABLE: never }
  : any;

export type IObservableLike<GValue extends INotAnObservable<GValue>> =
  | GValue
  | IObservable<GValue>
  | ISignal<GValue>
  ;
