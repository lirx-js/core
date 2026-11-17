import { SignalError } from '../../internal/signal-error.class';
import { IReadonlySignal } from '../../signal/types/readonly-signal.type';
import { IUnsubscribeOfWatch } from '../types/unsubscribe-of-watch.type';
import { IWatchCleanUpFunction } from '../types/watch-clean-up-function.type';
import { watch } from '../watch';
import { IWatchErrorFunction } from './types/watch-error-function.type';
import { WATCH_ERROR_THROW } from './types/watch-error-throw.constant';
import { IWatchValueFunction } from './types/watch-value-function.type';

export function watchValue<GValue>(
  signal: IReadonlySignal<GValue>,
  watchValueFunction: IWatchValueFunction<GValue>,
  watchErrorFunction: IWatchErrorFunction = WATCH_ERROR_THROW,
): IUnsubscribeOfWatch {
  return watch(signal, (value: GValue | SignalError): IWatchCleanUpFunction | void => {
    return value instanceof SignalError
      ? watchErrorFunction(value.error)
      : watchValueFunction(value);
  });
}
