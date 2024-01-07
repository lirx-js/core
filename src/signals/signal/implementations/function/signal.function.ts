import { SignalThrow } from '../../../error/signal-throw.class';
import { ISignal } from '../../signal.type';
import { ISignalOptions } from '../../types/signal-options.type';
import { Signal } from '../class/signal.class';

export function signal<GValue>(
  initialValue: GValue | SignalThrow,
  options?: ISignalOptions<GValue>,
): ISignal<GValue> {
  return new Signal<GValue>(initialValue, options);
}

