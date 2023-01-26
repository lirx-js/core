import { createNetworkErrorFromResponse } from '@lirx/utils';
import { IObservable } from '../../../../../../../type/observable.type';
import { throwError } from '../../../../others/throw-error/throw-error';
import { fromPromiseFactory } from '../../../../promise/from-promise-factory/from-promise-factory';
import { IFromFetchBodyObservableNotifications } from './from-fetch-body-observable-notifications.type';
import { IResponseToBodyMapFunction } from './response-to-body-map-function.type';

export interface IResponseToBodyObservableFunction<GData> {
  (
    response: Response,
  ): IObservable<IFromFetchBodyObservableNotifications<GData>>;
}

export function responseToBodyObservable<GData>(
  map: IResponseToBodyMapFunction<GData>,
): IResponseToBodyObservableFunction<GData> {
  return (
    response: Response,
  ): IObservable<IFromFetchBodyObservableNotifications<GData>> => {
    if (response.ok) {
      return fromPromiseFactory<GData>(() => map(response));
    } else {
      return throwError(createNetworkErrorFromResponse(response));
    }
  };
}
