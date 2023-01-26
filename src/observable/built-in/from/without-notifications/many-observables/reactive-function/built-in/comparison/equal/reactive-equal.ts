import { IObservable } from '../../../../../../../../type/observable.type';
import { optimizedReactiveFunction } from '../../../alternatives/optimized-reactive-function';
import { IReactiveFunctionObservables } from '../../../reactive-function';

export function reactiveEqual(
  ...observables: IReactiveFunctionObservables<typeof equal>
): IObservable<ReturnType<typeof equal>> {
  return optimizedReactiveFunction(
    observables,
    equal,
  );
}

function equal(a: any, b: any): boolean {
  return a === b;
}
