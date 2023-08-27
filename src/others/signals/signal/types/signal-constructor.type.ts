import { ISignalOptions } from './signal-options.type';
import { ISignal } from '../signal.type';

export interface ISignalConstructor {
  new<GValue>(
    initialValue: GValue,
    options?: ISignalOptions<GValue>,
  ): ISignal<GValue>;
}
