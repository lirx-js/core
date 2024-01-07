import { SignalThrow } from '../../../error/signal-throw.class';
import { ISignal } from '../../signal.type';
import { ISignalOptions } from '../../types/signal-options.type';
import { signal } from './signal.function';

export function thrownSignal<GValue>(
  error: any,
  options?: ISignalOptions<GValue>,
): ISignal<GValue> {
  return signal<GValue>(new SignalThrow(error), options);
}


