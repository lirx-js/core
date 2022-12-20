import { IObservable } from '../../../observable/type/observable.type';
import { IObserver } from '../../../observer/type/observer.type';

/* OPEN */
export interface IIOStreamOpenFunctionOptions {
  signal?: AbortSignal;
}

export interface IIOStreamOpenFunction<GInValue, GOutValue> {
  (
    options?: IIOStreamOpenFunctionOptions,
  ): Promise<IOStream<GInValue, GOutValue>>;
}

/* CLOSE */
export interface IIOStreamCloseFunction {
  (): Promise<void>;
}

/* STREAM */
export interface IOStream<GInValue, GOutValue> {
  readonly input$: IObservable<GInValue>;
  readonly $output: IObserver<GOutValue>;
  readonly error$: IObservable<Error>;
  readonly close: IIOStreamCloseFunction;
  readonly close$: IObservable<unknown>;
}
