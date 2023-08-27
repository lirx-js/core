import { ISignalOptions } from '../../signal/types/signal-options.type';

export interface ISignalFromObservableOptions<GValue> extends ISignalOptions<GValue> {
  initialValue?: GValue;
}
