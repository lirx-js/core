import { ISourceObservablePipeGetSource } from './source-observable-pipe-get-source.type';

export interface ISourceObservableOptions<GValue> {
  getSource: ISourceObservablePipeGetSource<GValue>;
  subscribePoint?: number; // Integer [1, MAX_INT]
  unsubscribePoint?: number; // Integer [0, subscribePoint - 1]
}
