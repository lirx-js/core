import { IObservable } from '../../../../../../../type/observable.type';
import { fromFetch } from '../../from-fetch';
import { IFromFetchArrayBufferObservableNotifications } from './from-fetch-array-buffer-observable-notifications.type';
import { responseToArrayBufferObservable } from './pipe/response-to-array-buffer-observable';

/**
 * Uses the Fetch API to make an HTTP request, and returns an ArrayBuffer
 */
export function fromFetchArrayBuffer(
  requestInfo: RequestInfo,
  requestInit?: RequestInit,
): IObservable<IFromFetchArrayBufferObservableNotifications> {
  return responseToArrayBufferObservable(
    fromFetch(
      requestInfo,
      requestInit,
    ),
  );
}

