import { IObserverObservablePair } from '../../../../../../../observer-observable-pair/type/observer-observable-pair.type';
import { fromReadableStream } from '../from-readable-stream/from-readable-stream';
import { fromWritableStream } from '../from-writable-stream/from-writable-stream';
import { IFromReadableWritablePairOnError } from './from-readable-writable-pair-on-error.type';
import { IFromReadableWritablePairReadableValueNotifications } from './from-readable-writable-pair-readable-value-notifications.type';
import { IFromReadableWritablePairWritableValueNotifications } from './from-readable-writable-pair-writable-value-notifications.type';

export function fromReadableWritablePair<GReadableValue, GWritableValue>(
  { readable, writable }: ReadableWritablePair<GReadableValue, GWritableValue>,
  onError?: IFromReadableWritablePairOnError,
): IObserverObservablePair<
  IFromReadableWritablePairWritableValueNotifications<GWritableValue>,
  IFromReadableWritablePairReadableValueNotifications<GReadableValue>
> {
  return {
    emit: fromWritableStream(writable, onError),
    subscribe: fromReadableStream(readable),
  };
}
