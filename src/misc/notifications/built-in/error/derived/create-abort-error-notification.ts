import { createAbortError, IAbortError, IAbortErrorOptions } from '@lirx/utils';
import { createErrorNotification } from '../create-error-notification';
import { IErrorNotification } from '../error-notification.type';

export function createAbortErrorNotification(
  options?: IAbortErrorOptions,
): IErrorNotification<IAbortError> {
  return createErrorNotification<IAbortError>(createAbortError(options));
}
