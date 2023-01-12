import { IObservable } from '../../../../../../../../type/observable.type';
import { optimizedReactiveFunction } from '../../../alternatives/optimized-reactive-function';
import { IReactiveFunctionObservables } from '../../../reactive-function';

export function reactiveAnd(
  ...observables: IReactiveFunctionObservables<typeof and>
): IObservable<ReturnType<typeof and>> {
  return optimizedReactiveFunction(
    observables,
    and,
  );
}

function and(a: boolean, b: boolean): boolean {
  return a && b;
}

