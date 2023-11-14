import { ISource } from '../../../../../observer-observable-pair/build-in/source/type/source.type';
import { IObserver } from '../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../type/observable.type';
import { ISourceObservableOptions } from './source-observable-options.type';

export function sourceObservable<GValue>(
  subscribe: IObservable<GValue>,
  {
    createSource,
    onSubscribe,
    onUnsubscribe,
  }: ISourceObservableOptions<GValue>,
): IObservable<GValue> {
  let source: ISource<GValue> | undefined;
  let unsubscribe: IUnsubscribeOfObservable | undefined;

  const start = (): void => {
    if (source === void 0) {
      source = createSource();
      unsubscribe = subscribe(source.emit);
    } else {
      throw new Error(`Already started`);
    }
  };

  const end = (): void => {
    if (source === void 0) {
      throw new Error(`Already ended`);
    } else {
      unsubscribe!();
      source = void 0;
      unsubscribe = void 0;
    }
  };

  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    let running: boolean = true;

    if (onSubscribe(emit)) {
      start();
    }

    const unsubscribeOfSource: IUnsubscribeOfObservable = source!.subscribe(emit);

    return (): void => {
      if (running) {
        running = false;
        unsubscribeOfSource();

        if (onUnsubscribe(emit)) {
          end();
        }
      }
    };
  };
}

