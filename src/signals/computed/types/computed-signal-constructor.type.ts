import { IComputedSignal } from '../computed-signal.type';
import { IComputedSignalFunction } from './computed-signal-function.type';
import { IComputedSignalOptions } from './computed-signal-options.type';

export interface IComputedSignalConstructor {
  new<GValue>(
    computedFunction: IComputedSignalFunction<GValue>,
    options?: IComputedSignalOptions<GValue>,
  ): IComputedSignal<GValue>;
}
