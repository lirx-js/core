import { IComputedSignal } from '../../computed-signal.type';
import { IComputedSignalFunction } from '../../types/computed-signal-function.type';
import { IComputedSignalOptions } from '../../types/computed-signal-options.type';
import { ComputedSignal } from '../class/computed-signal.class';

export function computed<GValue>(
  computedFunction: IComputedSignalFunction<GValue>,
  options?: IComputedSignalOptions<GValue>,
): IComputedSignal<GValue> {
  return new ComputedSignal<GValue>(computedFunction, options);
}
