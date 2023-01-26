import {
  createMulticastSource,
} from '../../../../../../../observer-observable-pair/build-in/source/built-in/multicast-source/create-multicast-source';
import {
  IMulticastSource,
} from '../../../../../../../observer-observable-pair/build-in/source/built-in/multicast-source/multicast-source.type';
import { IObserver } from '../../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribe } from '../../../../../../type/observable.type';
import { IDOMObserver, IDOMObserverEntry, IDOMObserverFactory } from './dom-observer.type';

export interface IDOMObserverObservableFactory<GOptions, GEntry extends IDOMObserverEntry> {
  (
    element: Element,
    options?: GOptions,
  ): IObservable<GEntry>;
}

export function createDOMObserverObservableFactory<GOptions, GEntry extends IDOMObserverEntry>(
  createObserver: IDOMObserverFactory<GOptions, GEntry>,
): IDOMObserverObservableFactory<GOptions, GEntry> {
  let observer: IDOMObserver<GOptions>;
  let _subscribe: IObservable<ReadonlyArray<GEntry>>;

  return (
    element: Element,
    options?: GOptions,
  ): IObservable<GEntry> => {
    return (emit: IObserver<GEntry>): IUnsubscribe => {
      let running: boolean = true;

      if (observer === void 0) {
        const { emit, subscribe }: IMulticastSource<ReadonlyArray<GEntry>> = createMulticastSource<ReadonlyArray<GEntry>>();
        observer = createObserver((entries: ReadonlyArray<GEntry>): void => {
          emit(entries);
        });
        _subscribe = subscribe;
      }

      const unsubscribe: IUnsubscribe = _subscribe((entries: ReadonlyArray<GEntry>): void => {
        for (let i = 0, l = entries.length; i < l; i++) {
          const entry: GEntry = entries[i];
          if (running && (entry.target === element)) {
            emit(entry);
            break;
          }
        }
      });

      observer.observe(element, options);

      return (): void => {
        if (running) {
          running = false;
          unsubscribe();
          observer.unobserve(element);
        }
      };
    };
  };
}


