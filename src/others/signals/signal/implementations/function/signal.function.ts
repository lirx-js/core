import { ISignalOptions } from '../../types/signal-options.type';
import { ISignal } from '../../signal.type';
import { Signal } from '../class/signal.class';

export function signal<GValue>(
  initialValue: GValue,
  options?: ISignalOptions<GValue>,
): ISignal<GValue> {
  return new Signal<GValue>(initialValue, options);
}
