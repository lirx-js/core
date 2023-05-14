import { ISignal } from '../signal.type';
import { IWritableSignalMutateFunction } from './writable-signal-mutate-function.type';
import { IWritableSignalUpdateFunction } from './writable-signal-update-function.type';

export interface IWritableSignal<GValue> extends ISignal<GValue> {
  /**
   * Directly set the Signal to a new value, and notify any dependents.
   *
   * Useful for changing primitive values or replacing data structures when
   * the new value is independent of the old one.
   *
   * If "force" is set to true, then the Signal is updated even if the provided
   * value is equal to its own current value.
   */
  set(
    value: GValue,
    force?: boolean, // (default: true)
  ): void;

  /**
   * Update the value of the Signal based on its current value, and
   * notify any dependents.
   *
   * Useful for setting a new value that depends on the old value, such as
   * updating an immutable data structure.
   */
  update(
    updateFunction: IWritableSignalUpdateFunction<GValue>,
  ): void;

  /**
   * Update the current value by mutating it in-place and notifying any
   * dependents.
   *
   * Useful for making internal changes to the Signal's value without changing
   * its identity, such as pushing to an array stored in the Signal.
   */
  mutate(
    mutateFunction: IWritableSignalMutateFunction<GValue>,
  ): void;

  /**
   * Return a non-writable Signal which accesses this WritableSignal
   * but does not allow mutation.
   */
  asReadonly(): ISignal<GValue>;
}
