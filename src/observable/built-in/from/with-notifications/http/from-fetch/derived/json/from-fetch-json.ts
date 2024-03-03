import { IObservable } from '../../../../../../../type/observable.type';
import { fromFetch } from '../../from-fetch';
import { IFromFetchJSONObservableNotifications } from './from-fetch-json-observable-notifications.type';
import { responseToJSONObservable } from './pipe/response-to-json-observable';

/**
 * Uses the Fetch API to make an HTTP request, and returns a JSON object
 */
export function fromFetchJSON<GData>(
  requestInfo: RequestInfo,
  requestInit?: RequestInit,
): IObservable<IFromFetchJSONObservableNotifications<GData>> {
  return responseToJSONObservable<GData>(fromFetch(requestInfo, requestInit));
}
