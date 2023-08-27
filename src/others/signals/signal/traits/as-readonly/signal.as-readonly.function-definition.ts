import { IReadonlySignal } from '../../../readonly-signal/readonly-signal.type';

export interface ISignalAsReadonlyFunction<GValue> {
  (): IReadonlySignal<GValue>;
}
