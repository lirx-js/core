import { ISignalSetTrait } from './traits/set/signal.set.trait';
import { IPureReadonlySignal } from '../readonly-signal/readonly-signal.type';
import { IReadonlySignalGetFunction } from '../readonly-signal/traits/get/readonly-signal.get.function-definition';
import { ISignalUpdateTrait } from './traits/update/signal.update.trait';
import { ISignalMutateTrait } from './traits/mutate/signal.mutate.trait';
import { ISignalThrowTrait } from './traits/throw/signal.throw.trait';

export interface IPureSignal<GValue> extends IPureReadonlySignal<GValue>, //
  ISignalSetTrait<GValue>,
  ISignalUpdateTrait<GValue>,
  ISignalMutateTrait<GValue>,
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
