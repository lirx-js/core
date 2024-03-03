import { futureUnsubscribe } from '@lirx/unsubscribe';
import { defaultNotificationObserver } from '../../misc/notifications/default-notification-observer';
import { IDefaultInNotificationsUnion } from '../../misc/notifications/default-notifications-union.type';
import { IObservable, IUnsubscribeOfObservable } from '../../observable/type/observable.type';
import { ERRORED, UNSET } from './computed.private';
import {
  reactiveNodeAddSignalChangeListener,
  reactiveNodeDispatchSignalChangeListeners,
} from './reactive-node.private';
import { ISignalNode, SIGNAL_NODE, signalSetNoCheck } from './signal.private';

export interface ISignalFromObservableNode<GValue> extends ISignalNode<GValue> {
  error: unknown;
  active: boolean;
  unsubscribeOnError: boolean;
  value$: IObservable<GValue> | IObservable<IDefaultInNotificationsUnion<GValue>>;
  unsubscribe: IUnsubscribeOfObservable;
}

export const SIGNAL_FROM_OBSERVABLE_NODE: ISignalFromObservableNode<unknown> = {
  ...SIGNAL_NODE,
  error: undefined,
  active: false,
  unsubscribeOnError: true,
  value$: undefined as any,
  unsubscribe: undefined as any,
};

export function signalFromObservableGet<GValue>(node: ISignalFromObservableNode<GValue>): GValue {
  reactiveNodeAddSignalChangeListener(node);
  if (node.value === UNSET) {
    throw new Error('No value received.');
  } else if (node.value === ERRORED) {
    throw node.error;
  }
  return node.value;
}

export function signalFromObservableIsActive<GValue>(
  node: ISignalFromObservableNode<GValue>,
): boolean {
  return node.active;
}

export function signalFromObservableActivateForRawValue<GValue>(
  node: ISignalFromObservableNode<GValue>,
): void {
  node.unsubscribe = (node.value$ as IObservable<GValue>)((value: GValue): void => {
    signalSetNoCheck<GValue>(node, value);
  });
}

export function signalFromObservableActivateForNotification<GValue>(
  node: ISignalFromObservableNode<GValue>,
): void {
  node.unsubscribe = futureUnsubscribe(
    (unsubscribe: IUnsubscribeOfObservable): IUnsubscribeOfObservable => {
      return (node.value$ as IObservable<IDefaultInNotificationsUnion<GValue>>)(
        defaultNotificationObserver<GValue>(
          /* next */ (value: GValue): void => {
            signalSetNoCheck<GValue>(node, value);
          },
          /* complete */ (): void => {
            unsubscribe();
          },
          /* error */ (error: unknown): void => {
            if (node.unsubscribeOnError) {
              unsubscribe();
            }
            node.value = ERRORED;
            node.error = error;
            reactiveNodeDispatchSignalChangeListeners(node);
          },
        ),
      );
    },
  );
}

export function signalFromObservableDeactivate<GValue>(
  node: ISignalFromObservableNode<GValue>,
): void {
  node.unsubscribe();
}

export function signalFromObservableActivateOrDeactivateForRawValue<GValue>(
  node: ISignalFromObservableNode<GValue>,
  active: boolean = true,
): void {
  if (active !== node.active) {
    if (active) {
      signalFromObservableActivateForRawValue(node);
    } else {
      signalFromObservableDeactivate(node);
    }
  }
}

export function signalFromObservableActivateOrDeactivateForNotification<GValue>(
  node: ISignalFromObservableNode<GValue>,
  active: boolean = true,
): void {
  if (active !== node.active) {
    if (active) {
      signalFromObservableActivateForNotification(node);
    } else {
      signalFromObservableDeactivate(node);
    }
  }
}
