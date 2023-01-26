import { IObservable } from '../../../../../../../../type/observable.type';
import { optimizedReactiveFunction } from '../../../alternatives/optimized-reactive-function';
import { IReactiveFunctionObservables } from '../../../reactive-function';

export function reactiveLowerThan(
  ...observables: IReactiveFunctionObservables<typeof lowerThan>
): IObservable<ReturnType<typeof lowerThan>> {
  return optimizedReactiveFunction(
    observables,
    lowerThan,
  );
}

function lowerThan(a: any, b: any): boolean {
  return a < b;
}
