import { ISourceObservablePipeCreateSource } from './source-observable-pipe-create-source.type';
import { ISourceObservableOnUnsubscribeFunction } from './source-observable-on-unsubscribe-function.type';
import { ISourceObservableOnSubscribeFunction } from './source-observable-on-subscribe-function.type';

export interface ISourceObservableOptions<GValue> {
  createSource: ISourceObservablePipeCreateSource<GValue>;
  onSubscribe: ISourceObservableOnSubscribeFunction<GValue>;
  onUnsubscribe: ISourceObservableOnUnsubscribeFunction<GValue>;
}
