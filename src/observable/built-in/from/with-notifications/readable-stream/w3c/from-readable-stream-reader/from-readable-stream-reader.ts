import { IObservable } from '../../../../../../type/observable.type';
import { fromAsyncIterator } from '../../../iterable/async/from-async-iterator/from-async-iterator';
import { IFromReadableStreamReaderObservableNotifications } from './from-readable-stream-reader-observable-notifications.type';

/**
 * WARN use with caution: it's possible that you subscribe twice to the same ReadableStreamReader, in this case the emitted values probably won't be what you expect
 */
export function fromReadableStreamReader<GValue>(
  reader: ReadableStreamDefaultReader<GValue>,
): IObservable<IFromReadableStreamReaderObservableNotifications<GValue>> {
  return fromAsyncIterator((async function* () {
    try {
      let result: ReadableStreamReadResult<GValue>;
      while (!(result = await reader.read()).done) {
        yield (result as ReadableStreamReadValueResult<GValue>).value;
      }
      // // INFO temp fix as yarn pnp is not well supported
      // let result: any;
      // while (!(result = await (reader as any).read()).done) {
      //   yield (result).value;
      // }
    } finally {
      reader.releaseLock();
    }
  })());
}
