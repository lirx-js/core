import { SignalThrow } from '../../error/signal-throw.class';

export interface IComputedSignalFunction<GValue> {
  (): GValue | SignalThrow;
}
