import { IObservable } from '../../../../../type/observable.type';
import { IObservablePipe } from '../../../../type/observable-pipe.type';
import { variationObservable } from './variation-observable';
import { IVariation } from './variation.type';

export function variationObservablePipe<GValue>(): IObservablePipe<GValue, IVariation<GValue>> {
  return (subscribe: IObservable<GValue>): IObservable<IVariation<GValue>> => {
    return variationObservable<GValue>(subscribe);
  };
}
