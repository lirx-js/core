import { SignalThrow } from '../../../error/signal-throw.class';

export interface ISignalUpdateFunctionCallback<GValue> {
  (
    value: GValue,
  ): GValue | SignalThrow;
}

export interface ISignalUpdateFunction<GValue> {
  (
    updateFunction: ISignalUpdateFunctionCallback<GValue>,
  ): void;
}
