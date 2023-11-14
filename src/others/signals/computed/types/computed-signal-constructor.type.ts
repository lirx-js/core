import { IComputedSignalFunction } from './computed-singal-function.type';
import { IComputedSignalOptions } from './computed-signal-options.type';
import { IComputedSignal } from '../computed-signal.type';

export interface IComputedSignalConstructor {
  new<GValue>(
    computedFunction: IComputedSignalFunction<GValue>,
    options?: IComputedSignalOptions<GValue>,
  ): IComputedSignal<GValue>;
}
