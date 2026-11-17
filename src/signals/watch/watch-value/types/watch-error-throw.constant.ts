import { IWatchErrorFunction } from './watch-error-function.type';

export const WATCH_ERROR_THROW: IWatchErrorFunction = (error: unknown): void => {
  throw error;
};
