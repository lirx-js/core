import { IWatchCleanUpFunction } from '../../types/watch-clean-up-function.type';

export interface IWatchErrorFunction {
  (error: unknown): IWatchCleanUpFunction | void;
}
