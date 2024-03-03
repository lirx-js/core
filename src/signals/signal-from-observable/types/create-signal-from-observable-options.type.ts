import { ICreateSignalOptions } from '../../signal/types/create-signal-options.type';

export interface ICreateSignalFromObservableSharedOptions<GValue>
  extends ICreateSignalOptions<GValue> {
  readonly initialValue?: GValue;
}

export interface ICreateSignalFromValueObservableOptions<GValue>
  extends ICreateSignalFromObservableSharedOptions<GValue> {
  readonly mode?: 'value'; // (default: 'value')
}

export interface ICreateSignalFromNotificationsObservableOptions<GValue>
  extends ICreateSignalFromObservableSharedOptions<GValue> {
  readonly mode: 'notification';
  readonly unsubscribeOnError?: boolean; // (default: true)
}

export type ICreateSignalFromObservableOptions<GValue> =
  | ICreateSignalFromValueObservableOptions<GValue>
  | ICreateSignalFromNotificationsObservableOptions<GValue>;
