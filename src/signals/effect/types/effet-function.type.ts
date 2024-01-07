import { IObservable } from '../../../observable/type/observable.type';

export type IOnCleanUpFunction = IObservable<void>;

export interface IEffetFunction {
  (
    onCleanUp: IOnCleanUpFunction,
  ): void;
}

