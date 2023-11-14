import { IObservable } from '../../../../../type/observable.type';
import { UNINITIALIZED_TOKEN } from '@lirx/utils';
import { scanObservable } from '../../observer-pipe-related/scan/scan-observable';
import { IVariation } from './variation.type';

export function variationObservable<GValue>(
  subscribe: IObservable<GValue>,
): IObservable<IVariation<GValue>> {
  return scanObservable<GValue, IVariation<GValue>>(subscribe, (variation: IVariation<GValue>, current: GValue): IVariation<GValue> => {
    return {
      previous: variation.current,
      current,
    };
  }, {
    previous: UNINITIALIZED_TOKEN,
    current: UNINITIALIZED_TOKEN,
  } as IVariation<GValue>);
}
