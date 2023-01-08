import { IAbortError, IAbortErrorOptions, createAbortError} from '@lirx/utils';
import { IErrorNotification } from '../error-notification.type';
import { createErrorNotification } from '../create-error-notification';

export function createAbortErrorNotification(
  options?: IAbortErrorOptions,
): IErrorNotification<IAbortError> {
  return createErrorNotification<IAbortError>(createAbortError(options));
}
