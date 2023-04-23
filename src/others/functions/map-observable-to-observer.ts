import { noop } from '@lirx/utils';
import { IObservable, IUnsubscribeOfObservable } from '../../observable/type/observable.type';
import { IMapFunction } from '../../observer/pipes/built-in/map/map-function.type';
import { IObserver } from '../../observer/type/observer.type';

/**
 * @experimental
 */
export type IMapObservableToObserverResult<GObserverValue> = [
  emit: IObserver<GObserverValue>,
  unsubscribe: IUnsubscribeOfObservable,
];

/**
 * @experimental
 */
export function mapObservableToObserver<GObservableValue, GObserverValue>(
  subscribe: IObservable<GObservableValue>,
  mapFunction: IMapFunction<GObservableValue, IObserver<GObserverValue>>,
): IMapObservableToObserverResult<GObserverValue> {
  let observer: IObserver<GObserverValue> = noop;

  return [
    (value: GObserverValue): void => {
      observer(value);
    },
    subscribe((value: GObservableValue): void => {
      observer = mapFunction(value);
    }),
  ];
}

// TODO doc

/*
const value$ = single('abc');

const [$onClick] = mapObservableToObserver(value$, (value: string): IObserver<Event> => {
  return (
    event: Event,
  ): void => {
    (event.target as HTMLInputElement).value = value;
  };
});

// later
input.addEventListener('click', $onClick);


 */
