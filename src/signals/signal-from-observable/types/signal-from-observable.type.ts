import { IReadonlySignal } from '../../signal/types/readonly-signal.type';

export interface ISignalFromObservable<GValue> extends IReadonlySignal<GValue> {
  isActive(): boolean;

  activate(active?: boolean): void;
}
