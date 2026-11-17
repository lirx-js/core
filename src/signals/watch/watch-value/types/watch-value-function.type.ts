import { IWatchCleanUpFunction } from '../../types/watch-clean-up-function.type';

export interface IWatchValueFunction<GValue> {
  (value: GValue): IWatchCleanUpFunction | void;
}
