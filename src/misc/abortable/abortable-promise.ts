import { fromEventTarget } from '../../observable/built-in/from/without-notifications/dom/from-event-target/from-event-target';
import { empty } from '../../observable/built-in/from/without-notifications/values/empty/empty';
import { IObservable } from '../../observable/type/observable.type';
import { createAbortError } from '../errors/abort-error/create-abort-error';

/** TYPES **/

export interface IAbortablePromiseResolveFunction<GValue> {
  (
    value: GValue | PromiseLike<GValue>,
  ): void;
}

export interface IAbortablePromiseRejectFunction {
  (
    reason?: any,
  ): void;
}

export interface ICreateAbortablePromiseFactoryFunction<GValue> {
  (
    resolve: IAbortablePromiseResolveFunction<GValue>,
    reject: IAbortablePromiseRejectFunction,
    abort$: IObservable<Event>,
  ): void;
}

/** FUNCTION **/

export function createAbortablePromise<GValue>(
  factory: ICreateAbortablePromiseFactoryFunction<GValue>,
  signal: AbortSignal | undefined,
): Promise<GValue> {
  return new Promise<GValue>((
    resolve: (value: GValue | PromiseLike<GValue>) => void,
    reject: (reason?: any) => void,
  ): void => {
    if (signal?.aborted) {
      reject(createAbortError({ signal }));
    } else {
      if (signal === void 0) {
        factory(resolve, reject, empty());
      } else {
        const end = () => {
          unsubscribeOfAbort();
        };

        const _resolve = (
          value: GValue | PromiseLike<GValue>,
        ): void => {
          end();
          resolve(value);
        };

        const _reject = (
          reason?: any,
        ): void => {
          end();
          reject(reason);
        };

        const onAbort = () => {
          _reject(createAbortError({ signal }));
        };

        const abort$ = fromEventTarget<'abort', Event>(signal, 'abort');

        const unsubscribeOfAbort = abort$(onAbort);

        try {
          factory(_resolve, _reject, abort$);
        } catch (error: unknown) {
          _reject(error);
        }
      }
    }
  });
}
