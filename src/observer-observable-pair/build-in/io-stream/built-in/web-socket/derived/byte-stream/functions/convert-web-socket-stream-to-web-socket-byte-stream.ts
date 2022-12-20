import { IWebSocketStream } from '../../../web-socket-stream.type';

import { IWebSocketByteStream } from '../web-socket-byte-stream.type';
import { webSocketInValueToArrayBufferObservable } from './web-socket-in-value-to-array-buffer-observable';
import { webSocketOutValueToUint8ArrayObserver } from './web-socket-out-value-to-uint8-array-observer';

export function convertWebSocketStreamToWebSocketByteStream(
  stream: IWebSocketStream,
): IWebSocketByteStream {
  return {
    ...stream,
    $output: webSocketOutValueToUint8ArrayObserver(stream.$output),
    input$: webSocketInValueToArrayBufferObservable(stream.input$),
  };
}
