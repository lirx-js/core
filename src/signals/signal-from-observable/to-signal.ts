import { IDefaultInNotificationsUnion } from '../../misc/notifications/default-notifications-union.type';
import { IObservable } from '../../observable/type/observable.type';
import { UNSET } from '../internal/computed.private';
import { reactiveNodeInit } from '../internal/reactive-node.private';
import { isInSignalContext } from '../internal/signal-change-context/signal-change-context.private';
import {
  ISignalFromObservableNode,
  SIGNAL_FROM_OBSERVABLE_NODE,
  signalFromObservableActivateOrDeactivateForNotification,
  signalFromObservableActivateOrDeactivateForRawValue,
  signalFromObservableGet,
  signalFromObservableIsActive,
} from '../internal/signal-from-observable.private';
import { SIGNAL } from '../signal/signal.symbol';
import {
  ICreateSignalFromNotificationsObservableOptions,
  ICreateSignalFromObservableOptions,
  ICreateSignalFromValueObservableOptions,
} from './types/create-signal-from-observable-options.type';
import { ISignalFromObservable } from './types/signal-from-observable.type';

export function toSignal<GValue>(
  value$: IObservable<GValue>,
  options?: ICreateSignalFromValueObservableOptions<GValue>,
): ISignalFromObservable<GValue>;
export function toSignal<GValue>(
  value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
  options: ICreateSignalFromNotificationsObservableOptions<GValue>,
): ISignalFromObservable<GValue>;
export function toSignal<GValue>(
  value$: IObservable<GValue> | IObservable<IDefaultInNotificationsUnion<GValue>>,
  options?:
    | ICreateSignalFromObservableOptions<GValue>
    | ICreateSignalFromNotificationsObservableOptions<GValue>,
): ISignalFromObservable<GValue> {
  if (isInSignalContext()) {
    throw new Error('Cannot create a signal is this context.');
  }

  const node: ISignalFromObservableNode<GValue> = Object.create(SIGNAL_FROM_OBSERVABLE_NODE);
  reactiveNodeInit(node);
  node.value = UNSET;
  node.value$ = value$;

  const signal: ISignalFromObservable<GValue> = ((): GValue =>
    signalFromObservableGet(node)) as ISignalFromObservable<GValue>;
  signal[SIGNAL] = node;

  if (options) {
    if (options.equal) {
      node.equal = options.equal;
    }

    if ('initialValue' in options) {
      node.value = options.initialValue!;
    }
  }

  signal.isActive = (): boolean => signalFromObservableIsActive(node);
  signal.activate =
    options?.mode === 'notification'
      ? (activate?: boolean): void =>
          signalFromObservableActivateOrDeactivateForNotification(node, activate)
      : (activate?: boolean): void =>
          signalFromObservableActivateOrDeactivateForRawValue(node, activate);

  signal.activate(true);

  return signal;
}
