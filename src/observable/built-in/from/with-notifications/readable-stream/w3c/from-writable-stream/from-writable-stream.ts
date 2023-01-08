import { createLockError } from '@lirx/utils';
import { IObserver } from '../../../../../../../observer/type/observer.type';
import { fromWritableStreamDefaultWriter } from '../from-writable-stream-default-writer/from-writable-stream-default-writer';
import { IFromWritableStreamObserverNotifications } from './from-writable-stream-observer-notifications.type';
import { IFromWritableStreamObserverOnError } from './from-writable-stream-observer-on-error.type';

export function fromWritableStream<GValue>(
  writableStream: WritableStream<GValue>,
  onError?: IFromWritableStreamObserverOnError,
): IObserver<IFromWritableStreamObserverNotifications<GValue>> {
  if (writableStream.locked) {
    throw createLockError();
  } else {
    return fromWritableStreamDefaultWriter(
      writableStream.getWriter(),
      onError,
    );
  }
}
