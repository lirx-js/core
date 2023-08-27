import { ISignalFromObservableActivateTrait } from './traits/activate/signal-from-observable.activate.trait';
import { IPureReadonlySignal } from '../readonly-signal/readonly-signal.type';
import { IReadonlySignalGetFunction } from '../readonly-signal/traits/get/readonly-signal.get.function-definition';
import { ISignalFromObservableIsActiveTrait } from './traits/is-active/signal-from-observable.is-active.trait';

export interface IPureSignalFromObservable<GValue> extends IPureReadonlySignal<GValue>, //
  ISignalFromObservableIsActiveTrait,
  ISignalFromObservableActivateTrait
  //
{

}

export interface ISignalFromObservable<GValue> extends IPureSignalFromObservable<GValue>, //
  IReadonlySignalGetFunction<GValue>
  //
{

}

export type IGenericSignalFromObservable = ISignalFromObservable<any>;
