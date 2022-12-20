import { createAbortablePromise } from '../../../../../misc/abortable/abortable-promise';
import { noop } from '../../../../../misc/helpers/noop';
import { fromEventTarget } from '../../../../../observable/built-in/from/without-notifications/dom/from-event-target/from-event-target';
import { toPromise } from '../../../../../observable/built-in/to/without-notifications/promise/to-promise';
import { mapObservable } from '../../../../../observable/pipes/built-in/without-notifications/observer-pipe-related/map/map-observable';
import { IObservable, IUnsubscribe } from '../../../../../observable/type/observable.type';
import { IWebSocketInValue, IWebSocketOutValue, IWebSocketStream } from './web-socket-stream.type';

export interface IOpenWebSocketStreamOptions {
  signal?: AbortSignal;
}

export function openWebSocketStream(
  socket: WebSocket,
  {
    signal,
  }: IOpenWebSocketStreamOptions = {},
): Promise<IWebSocketStream> {
  return createAbortablePromise<IWebSocketStream>((
    resolve: (value: IWebSocketStream) => void,
    reject: (reason: Error) => void,
    abort$: IObservable<Event>,
  ): void => {
    if (
      (socket.readyState === socket.CONNECTING)
      || (socket.readyState === socket.OPEN)
    ) {
      let end: IUnsubscribe;

      const _end = (): void => {
        unsubscribeOfCloseEvent();
        unsubscribeOfErrorEvent();
      };

      // EVENTS
      const message$ = fromEventTarget<'message', MessageEvent<IWebSocketInValue>>(socket, 'message');
      const close$ = fromEventTarget<'close', CloseEvent>(socket, 'close');
      const error$ = mapObservable(fromEventTarget<'error', Event>(socket, 'error'), () => new Error(`WebSocket Error`));

      const unsubscribeOfCloseEvent = close$((): void => {
        end();
      });

      const unsubscribeOfErrorEvent = error$((error: Error): void => {
        end();
        reject(error);
      });

      // OPEN
      const open = (): void => {
        const input$ = mapObservable<MessageEvent<IWebSocketInValue>, IWebSocketInValue>(message$, (event: MessageEvent<IWebSocketInValue>): IWebSocketInValue => {
          return event.data;
        });

        const $output = (
          value: IWebSocketOutValue,
        ): void => {
          socket.send(value);
        };

        resolve({
          input$,
          $output,
          close,
          close$,
          error$,
        });
      };

      // CLOSE
      let closePromise: Promise<void>;

      const close = (
        code?: number,
        reason?: string,
      ): Promise<void> => {
        if (closePromise === void 0) {
          closePromise = toPromise(close$).then(noop);

          if (
            (socket.readyState === socket.CONNECTING)
            || (socket.readyState === socket.OPEN)
          ) {
            end();
            socket.close(
              code,
              reason,
            );
          }
        }

        return closePromise;
      };

      if (socket.readyState === socket.OPEN) {
        end = _end;
      } else {
        end = (): void => {
          _end();
          unsubscribeOfOpenEvent();
          unsubscribeOfAbortEvent();
        };

        const open$ = fromEventTarget<'open', Event>(socket, 'open');

        const unsubscribeOfOpenEvent = open$((): void => {
          unsubscribeOfOpenEvent();
          unsubscribeOfAbortEvent();
          open();
        });

        const unsubscribeOfAbortEvent = abort$(end);
      }
    } else {
      reject(new Error(`Socket should be in a CONNECTING state`));
    }
  }, signal);
}

