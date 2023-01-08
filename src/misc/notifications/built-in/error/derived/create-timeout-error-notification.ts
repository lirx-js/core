import { ITimeoutError, ITimeoutErrorOptions, createTimeoutError } from '@lirx/utils';
import { IErrorNotification } from '../error-notification.type';
import { createErrorNotification } from '../create-error-notification';

export function createTimeoutErrorNotification(
  options?: ITimeoutErrorOptions,
): IErrorNotification<ITimeoutError> {
  return createErrorNotification<ITimeoutError>(createTimeoutError(options));
}
