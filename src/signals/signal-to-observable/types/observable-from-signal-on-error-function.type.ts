import {
  IMapFilterDiscard,
  MAP_FILTER_DISCARD,
} from '../../../observer/pipes/built-in/map-filter/map-filter-discard.constant';
import { IMapFilterMapFunctionReturn } from '../../../observer/pipes/built-in/map-filter/map-filter-map-function.type';

export interface IObservableFromSignalOnErrorFunction<GValue> {
  (error: unknown): IMapFilterMapFunctionReturn<GValue>;
}

export const DEFAULT_OBSERVABLE_FROM_SIGNAL_ON_ERROR_FUNCTION = (
  error: unknown,
): IMapFilterDiscard => {
  console.error(error);
  return MAP_FILTER_DISCARD;
};
