import { Writable } from '@lirx/utils';

export interface ISignalMutateFunctionCallback<GValue> {
  (
    value: Writable<GValue>,
  ): void;
}

export interface ISignalMutateFunction<GValue> {
  (
    mutateFunction: ISignalMutateFunctionCallback<GValue>,
  ): void;
}
