import { createTimeoutError, ITimeoutError, ITimeoutErrorOptions } from '@lirx/utils';
import { createErrorNotification } from '../create-error-notification';
import { IErrorNotification } from '../error-notification.type';

export function createTimeoutErrorNotification(
  options?: ITimeoutErrorOptions,
): IErrorNotification<ITimeoutError> {
  return createErrorNotification<ITimeoutError>(createTimeoutError(options));
}
