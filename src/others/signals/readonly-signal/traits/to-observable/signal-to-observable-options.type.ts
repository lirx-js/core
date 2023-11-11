import { IMapFilterMapFunctionReturn } from '../../../../../observer/pipes/built-in/map-filter/map-filter-map-function.type';
import { IMapFilterDiscard, MAP_FILTER_DISCARD } from '../../../../../observer/pipes/built-in/map-filter/map-filter-discard.constant';

export type ISignalToObservableMode =
  | 'value'
  | 'notification'
  ;

export interface ISignalToObservableSharedOptions {
  readonly emitCurrentValue?: boolean; // (default: true)
  readonly debounce?: boolean; // (default: true)
}

export interface ISignalToValueObservableOnErrorFunction<GValue> {
  (
    error: unknown,
  ): IMapFilterMapFunctionReturn<GValue>;
}

export interface ISignalToValueObservableOptions<GValue> extends ISignalToObservableSharedOptions {
  readonly mode?: 'value'; // (default: 'value')
  readonly onError?: ISignalToValueObservableOnErrorFunction<GValue>; // (default: logs the error, and discards the value)
}

export interface ISignalToNotificationsObservableOptions extends ISignalToObservableSharedOptions {
  readonly mode: 'notification';
}

export type ISignalToObservableOptions<GValue> =
  | ISignalToValueObservableOptions<GValue>
  | ISignalToNotificationsObservableOptions
  ;

export const DEFAULT_SIGNAL_TO_VALUE_OBSERVABLE_ON_ERROR_FUNCTION = (
  error: unknown,
): IMapFilterDiscard => {
  console.error(error);
  return MAP_FILTER_DISCARD;
};
