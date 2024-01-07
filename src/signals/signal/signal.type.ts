import { IPureReadonlySignal } from '../readonly-signal/readonly-signal.type';
import { IReadonlySignalGetFunction } from '../readonly-signal/traits/get/readonly-signal.get.function-definition';
import { ISignalSetTrait } from './traits/set/signal.set.trait';
import { ISignalThrowTrait } from './traits/throw/signal.throw.trait';
import { ISignalUpdateTrait } from './traits/update/signal.update.trait';

export interface IPureSignal<GValue> extends IPureReadonlySignal<GValue>, //
  ISignalSetTrait<GValue>,
  ISignalUpdateTrait<GValue>,
  ISignalThrowTrait
  //
{

}

export interface ISignal<GValue> extends IPureSignal<GValue>, //
  IReadonlySignalGetFunction<GValue>
  //
{

}

export type IGenericSignal = ISignal<any>;
