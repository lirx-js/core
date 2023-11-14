import { ISource } from '../../../../../observer-observable-pair/build-in/source/type/source.type';

export interface ISourceObservablePipeCreateSource<GValue> {
  (): ISource<GValue>;
}
