import { IShareObservablePipeCreateMulticastSource } from './share-observable-pipe-create-multicast-source.type';
import { IShareObservablePipeCreateUnicastSource } from './share-observable-pipe-create-unicast-source.type';

export type IShareObservablePipeCreateSource<GValue> =
  | IShareObservablePipeCreateMulticastSource<GValue>
  | IShareObservablePipeCreateUnicastSource<GValue>
  ;
