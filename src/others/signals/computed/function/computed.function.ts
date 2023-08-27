import { ComputedSignal } from '../class/computed-signal.class';
import { IComputedSignalFunction } from '../types/computed-singal-function.type';
import { IComputedSignalOptions } from '../types/computed-signal-options.type';
import { IComputedSignal } from '../computed-signal.type';

export function computed<GValue>(
  computedFunction: IComputedSignalFunction<GValue>,
  options?: IComputedSignalOptions<GValue>,
): IComputedSignal<GValue> {
  return new ComputedSignal<GValue>(computedFunction, options);
}
