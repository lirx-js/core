import { SignalUninitializedError } from '../../../error/signal-uninitialized-error.class';
import { ISignal } from '../../signal.type';
import { ISignalOptions } from '../../types/signal-options.type';
import { thrownSignal } from './thrown-signal.function';

export function uninitializedSignal<GValue>(
  options?: ISignalOptions<GValue>,
): ISignal<GValue> {
  return thrownSignal<GValue>(
    new SignalUninitializedError(),
    options,
  );
}
