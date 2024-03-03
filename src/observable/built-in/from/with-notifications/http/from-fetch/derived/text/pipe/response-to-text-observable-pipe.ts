import { IThenObservableInNotifications } from '../../../../../../../../pipes/built-in/with-notifications/then/then-observable';
import { IObservablePipe } from '../../../../../../../../pipes/type/observable-pipe.type';
import { IObservable } from '../../../../../../../../type/observable.type';
import { IFromFetchTextObservableNotifications } from '../from-fetch-text-observable-notifications.type';
import { responseToTextObservable } from './response-to-text-observable';

export function responseToTextObservablePipe(): IObservablePipe<
  IThenObservableInNotifications<Response>,
  IFromFetchTextObservableNotifications
> {
  return (
    subscribe: IObservable<IThenObservableInNotifications<Response>>,
  ): IObservable<IFromFetchTextObservableNotifications> => {
    return responseToTextObservable(subscribe);
  };
}
