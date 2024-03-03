import { SIGNAL } from '../signal.symbol';

export interface IReadonlySignal<GValue> {
  (): GValue;

  [SIGNAL]: unknown;
}
