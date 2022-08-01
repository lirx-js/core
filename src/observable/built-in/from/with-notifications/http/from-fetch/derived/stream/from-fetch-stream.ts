import { IObservable } from '../../../../../../../type/observable.type';
import { fromFetch } from '../../from-fetch';
import { IFromFetchStreamObservableNotifications } from './from-fetch-stream-observable-notifications.type';
import { responseToStreamObservable } from './pipe/response-to-stream-observable';

/**
 * Uses the Fetch API to make an HTTP request, and returns the result as a stream of Uint8Array
 */
export function fromFetchStream(
  requestInfo: RequestInfo,
  requestInit?: RequestInit,
): IObservable<IFromFetchStreamObservableNotifications> {
  return responseToStreamObservable(
    fromFetch(
      requestInfo,
      requestInit,
    ),
  );
}

