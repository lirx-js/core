import { IWatchErrorFunction } from './watch-error-function.type';

export const WATCH_ERROR_REPORT: IWatchErrorFunction = (error: unknown): void => {
  console.error(error);
};
