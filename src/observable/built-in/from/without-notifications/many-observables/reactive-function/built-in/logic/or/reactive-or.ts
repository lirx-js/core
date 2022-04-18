import { IReactiveFunctionObservables } from '../../../reactive-function';
import { IObservable } from '../../../../../../../../type/observable.type';
import { optimizedReactiveFunction } from '../../../alternatives/optimized-reactive-function';

export function reactiveOr(
  ...observables: IReactiveFunctionObservables<typeof or>
): IObservable<ReturnType<typeof or>> {
  return optimizedReactiveFunction(
    observables,
    or,
  );
}

function or(a: boolean, b: boolean): boolean {
  return a || b;
}

