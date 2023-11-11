import { ISignalOptions } from '../../types/signal-options.type';
import { ISignal } from '../../signal.type';
import { signal } from './signal.function';
import { SignalThrow } from '../../../error/signal-throw.class';
import { thrownSignal } from './thrown-signal.function';

export function uninitializedSignal<GValue>(
  options?: ISignalOptions<GValue>,
): ISignal<GValue> {
  return thrownSignal<GValue>(new Error(`The signal has no value.`), options);
}
