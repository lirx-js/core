import { createEmptyError } from '@lirx/utils';
import { IGenericObservable, IObservable } from '../../../../../type/observable.type';
import { IMergeObservablesValues, merge } from './merge';

export function mergeThrowIfEmpty<GObservables extends readonly IGenericObservable[]>(
  observables: GObservables,
): IObservable<IMergeObservablesValues<GObservables>> {
  if (observables.length === 0) {
    throw createEmptyError();
  } else {
    return merge<GObservables>(observables);
  }
}
