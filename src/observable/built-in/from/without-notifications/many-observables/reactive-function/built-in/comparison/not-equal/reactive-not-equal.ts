import { IReactiveFunctionObservables } from '../../../reactive-function';
import { IObservable } from '../../../../../../../../type/observable.type';
import { optimizedReactiveFunction } from '../../../alternatives/optimized-reactive-function';

export function reactiveNotEqual(
  ...observables: IReactiveFunctionObservables<typeof notEqual>
): IObservable<ReturnType<typeof notEqual>> {
  return optimizedReactiveFunction(
    observables,
    notEqual,
  );
}

function notEqual(a: any, b: any): boolean {
  return a !== b;
}
