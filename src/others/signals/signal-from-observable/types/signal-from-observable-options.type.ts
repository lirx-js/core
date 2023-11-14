import { ISignalOptions } from '../../signal/types/signal-options.type';

export type ISignalFromObservableMode =
  | 'value'
  | 'notification'
  ;

export interface ISignalFromObservableSharedOptions<GValue> extends ISignalOptions<GValue> {
}

export interface ISignalFromValueObservableOptions<GValue> extends ISignalFromObservableSharedOptions<GValue> {
  readonly mode?: 'value'; // (default: 'value')
}

export interface ISignalFromNotificationsObservableOptions<GValue> extends ISignalFromObservableSharedOptions<GValue> {
  readonly mode: 'notification';
  readonly unsubscribeOnError?: boolean; // (default: true)
}

export type ISignalFromObservableOptions<GValue> =
  | ISignalFromValueObservableOptions<GValue>
  | ISignalFromNotificationsObservableOptions<GValue>
  ;
