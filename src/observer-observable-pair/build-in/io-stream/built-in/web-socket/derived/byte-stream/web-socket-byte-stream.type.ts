import { IByteStream } from '../../../../derived/byte-stream/byte-stream.type';
import { IWebSocketStream } from '../../web-socket-stream.type';

type IDifferentKeys =
  | 'input$'
  | '$output'
  ;

export interface IWebSocketByteStream extends Pick<IByteStream, IDifferentKeys>, Omit<IWebSocketStream, IDifferentKeys> {

}
