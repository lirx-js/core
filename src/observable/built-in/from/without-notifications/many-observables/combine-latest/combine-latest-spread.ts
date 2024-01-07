import { IGenericObservable, IObservable } from '../../../../../type/observable.type';
import { combineLatest, ICombineLatestObservablesValues } from './combine-latest';

export function combineLatestSpread<GObservables extends readonly IGenericObservable[]>(
  ...observables: GObservables
): IObservable<ICombineLatestObservablesValues<GObservables>> {
  return combineLatest<GObservables>(observables);
}
