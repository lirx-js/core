import { IMulticastSource } from '../../../../../../observer-observable-pair/build-in/source/built-in/multicast-source/multicast-source.type';
import { ISourceObservablePipeCreateSource } from '../source-observable-pipe-create-source.type';

export interface IShareObservablePipeCreateMulticastSource<GValue>
  extends ISourceObservablePipeCreateSource<GValue> {
  (): IMulticastSource<GValue>;
}
