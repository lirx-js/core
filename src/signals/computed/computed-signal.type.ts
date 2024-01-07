import { IPureReadonlySignal } from '../readonly-signal/readonly-signal.type';
import { IReadonlySignalGetFunction } from '../readonly-signal/traits/get/readonly-signal.get.function-definition';

export interface IPureComputedSignal<GValue> extends IPureReadonlySignal<GValue> {

}

export interface IComputedSignal<GValue> extends IPureComputedSignal<GValue>, //
  IReadonlySignalGetFunction<GValue>
  //
{

}

