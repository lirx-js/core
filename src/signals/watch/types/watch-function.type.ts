import { SignalError } from '../../internal/signal-error.class';
import { IWatchCleanUpFunction } from './watch-clean-up-function.type';

export interface IWatchFunction<GValue> {
  (value: GValue | SignalError): IWatchCleanUpFunction | void;
}
