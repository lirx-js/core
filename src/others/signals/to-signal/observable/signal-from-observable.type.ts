import { ISignal } from '../../signal/signal.type';

export interface ISignalFromObservable<GValue> extends ISignal<GValue> {
  isActive(): boolean;

  activate(
    active?: boolean,
  ): this;
}
