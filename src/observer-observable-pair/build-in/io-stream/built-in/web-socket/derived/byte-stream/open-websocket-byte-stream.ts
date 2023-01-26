import { createAbortableFunction, IPromise } from '@lirx/promise';
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
): IPromise<IWebSocketByteStream> {
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
      createAbortableFunction(convertWebSocketStreamToWebSocketByteStream, { signal }),
    );
}

