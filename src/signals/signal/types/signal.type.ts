import { IReadonlySignal } from './readonly-signal.type';
import { ISignalUpdateFunctionCallback } from './signal-update-function-callback.type';

export interface ISignal<GValue> extends IReadonlySignal<GValue> {
  set(value: GValue): void;

  throw(error: unknown): void;

  update(updateFunction: ISignalUpdateFunctionCallback<GValue>): void;

  asReadonly(): IReadonlySignal<GValue>;
}
