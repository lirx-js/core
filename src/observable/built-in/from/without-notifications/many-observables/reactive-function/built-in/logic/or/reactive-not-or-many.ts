import { IObservable } from '../../../../../../../../type/observable.type';
import { IReactiveFunctionObservables } from '../../../reactive-function';
import { optimizedReactiveFunction } from '../../../alternatives/optimized-reactive-function';


export function reactiveNotOrMany(
  ...observables: IReactiveFunctionObservables<typeof notOrMany>
): IObservable<ReturnType<typeof notOrMany>> {
  return optimizedReactiveFunction(
    observables,
    notOrMany,
  );
}

function notOrMany(...values: boolean[]): boolean {
  for (let i = 0, l = values.length; i < l; i++) {
    if (values[i]) {
      return false;
    }
  }
  return true;
}

