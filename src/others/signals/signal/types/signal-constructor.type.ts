import { ISignalOptions } from './signal-options.type';
import { ISignal } from '../signal.type';
import { SignalThrow } from '../../error/signal-throw.class';

export interface ISignalConstructor {
  new<GValue>(
    initialValue?: GValue | SignalThrow | undefined,
    options?: ISignalOptions<GValue>,
  ): ISignal<GValue>;
}
