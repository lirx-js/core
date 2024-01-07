import { SignalThrow } from '../../../error/signal-throw.class';

export interface ISignalSetFunction<GValue> {
  (
    value: GValue | SignalThrow,
  ): void;
}
