import { SignalThrow } from '../../error/signal-throw.class';
import { ISignal } from '../signal.type';
import { ISignalOptions } from './signal-options.type';

export interface ISignalConstructor {
  new<GValue>(
    initialValue: GValue | SignalThrow,
    options?: ISignalOptions<GValue>,
  ): ISignal<GValue>;
}
