import {
  wrapFunctionWithOptionalAbortSignalAndThrow,
} from '../../../../../../../misc/abortable/for-function/wrap-function-with-abort-signal';
import { IOpenWebSocketStreamOptions, openWebSocketStream } from '../../open-web-socket-stream';
import { convertWebSocketStreamToWebSocketByteStream } from './functions/convert-web-socket-stream-to-web-socket-byte-stream';
import { createArrayBufferWebSocket } from './functions/create-array-buffer-web-socket';
import { IWebSocketByteStream } from './web-socket-byte-stream.type';

export interface IOpenWebSocketByteStreamOptions extends Omit<IOpenWebSocketStreamOptions, 'socket'> {
  url: string;
  protocols?: string | string[];
}

export function openWebSocketByteStream(
  {
    url,
    protocols,
    signal,
  }: IOpenWebSocketByteStreamOptions,
): Promise<IWebSocketByteStream> {
  return openWebSocketStream(
    createArrayBufferWebSocket(
      url,
      protocols,
    ),
    {
      signal,
    },
  )
    .then(
      wrapFunctionWithOptionalAbortSignalAndThrow(convertWebSocketStreamToWebSocketByteStream, signal),
    );
}

