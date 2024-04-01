import { futureUnsubscribe } from '@lirx/unsubscribe';
import { defaultNotificationObserver } from '../../misc/notifications/default-notification-observer';
import { IDefaultInNotificationsUnion } from '../../misc/notifications/default-notifications-union.type';
import { IObservable, IUnsubscribeOfObservable } from '../../observable/type/observable.type';
import { reactiveProducerGet } from './reactive-context.private';
import { ISignalNode, SIGNAL_NODE, signalSet, signalThrow } from './signal.private';

export interface ISignalFromObservableNode<GValue> extends ISignalNode<GValue> {
  active: boolean;
  unsubscribeOnError: boolean;
  value$: IObservable<GValue> | IObservable<IDefaultInNotificationsUnion<GValue>>;
  unsubscribe: IUnsubscribeOfObservable;
}

export const SIGNAL_FROM_OBSERVABLE_NODE: ISignalFromObservableNode<unknown> = {
  ...SIGNAL_NODE,
  active: false,
  unsubscribeOnError: true,
  value$: undefined as any,
  unsubscribe: undefined as any,
};

export function signalFromObservableGet<GValue>(node: ISignalFromObservableNode<GValue>): GValue {
  return reactiveProducerGet<GValue>(node);
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
    signalSet<GValue>(node, value);
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
            signalSet<GValue>(node, value);
          },
          /* complete */ (): void => {
            unsubscribe();
          },
          /* error */ (error: unknown): void => {
            if (node.unsubscribeOnError) {
              unsubscribe();
            }
            signalThrow<GValue>(node, error);
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
