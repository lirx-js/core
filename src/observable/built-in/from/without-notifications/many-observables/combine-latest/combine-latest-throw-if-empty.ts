import { createEmptyError } from '@lirx/utils';
import { IGenericObservable, IObservable } from '../../../../../type/observable.type';
import { ICombineLatestObservablesValues, combineLatest } from './combine-latest';

export function combineLatestThrowIfEmpty<GObservables extends readonly IGenericObservable[]>(
  observables: GObservables,
): IObservable<ICombineLatestObservablesValues<GObservables>> {
  if (observables.length === 0) {
    throw createEmptyError();
  } else {
    return combineLatest<GObservables>(observables);
  }
}
