import { ITimeoutError } from '@lirx/utils';
import { createTimeoutErrorNotification } from '../../../../../../../misc/notifications/built-in/error/derived/create-timeout-error-notification';
import { IErrorNotification } from '../../../../../../../misc/notifications/built-in/error/error-notification.type';
import { IObservable } from '../../../../../../type/observable.type';
import { timeout } from '../timeout';

export function timeoutWithErrorNotification(
  duration: number,
): IObservable<IErrorNotification<ITimeoutError>> {
  return timeout<IErrorNotification<ITimeoutError>>(
    duration,
    (): IErrorNotification<ITimeoutError> => createTimeoutErrorNotification(),
  );
}
