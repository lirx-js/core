import { IGenericFunction } from '@lirx/utils';
import { distinctObservable } from '../../../../../../pipes/built-in/without-notifications/observer-pipe-related/distinct/distinct-observable';
import { mapObservable } from '../../../../../../pipes/built-in/without-notifications/observer-pipe-related/map/map-observable';
import { debounceMicrotaskObservable } from '../../../../../../pipes/built-in/without-notifications/time-related/debounce-microtask/debounce-microtask-observable';
import {
  combineLatest,
  ICombineLatestObservablesValues,
} from '../../combine-latest/combine-latest';
import { IReactiveFunctionObservables, IReactiveFunctionReturn } from '../reactive-function';

export function optimizedReactiveFunction<GFunction extends IGenericFunction>(
  observables: IReactiveFunctionObservables<GFunction>,
  fnc: GFunction,
): IReactiveFunctionReturn<GFunction> {
  type GObservables = IReactiveFunctionObservables<GFunction>;
  type GCombineLastObservables = ICombineLatestObservablesValues<GObservables>;
  type GOut = ReturnType<GFunction>;

  return distinctObservable<GOut>(
    mapObservable<GCombineLastObservables, GOut>(
      debounceMicrotaskObservable<GCombineLastObservables>(
        combineLatest<GObservables>(observables),
      ),
      (args: GCombineLastObservables): GOut => fnc(...(args as any)),
    ),
  );
  // return distinctObservable<GOut>(debounceMicrotaskObservable<GOut>(reactiveFunction<GFunction>(observables, fnc)));
}
