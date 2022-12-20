import { IObservable } from '../../../../../observable/type/observable.type';
import { IOStream } from '../../io-stream.type';

export type IWebSocketInValue = string | Blob | ArrayBuffer;
export type IWebSocketOutValue = string | ArrayBufferLike | Blob | ArrayBufferView;

/* CLOSE */
export interface IWebSocketStreamCloseFunction {
  (
    code?: number,
    reason?: string,
  ): Promise<void>;
}

/* STREAM */

export interface IWebSocketStream extends IOStream<IWebSocketInValue, IWebSocketOutValue> {
  readonly close: IWebSocketStreamCloseFunction;
  readonly close$: IObservable<CloseEvent>;
}
