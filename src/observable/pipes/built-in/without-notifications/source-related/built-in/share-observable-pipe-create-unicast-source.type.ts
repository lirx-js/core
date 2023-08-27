import { IUnicastSource } from '../../../../../../observer-observable-pair/build-in/source/built-in/unicast-source/unicast-source.type';
import { ISourceObservablePipeCreateSource } from '../source-observable-pipe-create-source.type';

export interface IShareObservablePipeCreateUnicastSource<GValue> extends ISourceObservablePipeCreateSource<GValue> {
  (): IUnicastSource<GValue>;
}
