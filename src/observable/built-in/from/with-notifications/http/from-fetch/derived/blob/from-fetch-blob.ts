import { IObservable } from '../../../../../../../type/observable.type';
import { fromFetch } from '../../from-fetch';
import { IFromFetchBlobObservableNotifications } from './from-fetch-blob-observable-notifications.type';
import { responseToBlobObservable } from './pipe/response-to-blob-observable';

/**
 * Uses the Fetch API to make an HTTP request, and returns a Blob
 */
export function fromFetchBlob(
  requestInfo: RequestInfo,
  requestInit?: RequestInit,
): IObservable<IFromFetchBlobObservableNotifications> {
  return responseToBlobObservable(
    fromFetch(
      requestInfo,
      requestInit,
    ),
  );
}

