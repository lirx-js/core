import { TupleTypes } from '@lirx/utils';
import { INextNotification } from '../../../../../../misc/notifications/built-in/next/next-notification.type';
import {
  IDefaultInNotificationsUnion,
  IDefaultNotificationsUnion,
} from '../../../../../../misc/notifications/default-notifications-union.type';
import { IObservable } from '../../../../../type/observable.type';

export type IGenericMergeWithNotificationsInNotifications = IDefaultInNotificationsUnion<any>;

export type IGenericMergeWithNotificationsInObservable =
  IObservable<IGenericMergeWithNotificationsInNotifications>;

export type IGenericMergeWithNotificationsInObservables =
  readonly IGenericMergeWithNotificationsInObservable[];

export type IMergeWithNotificationsObservablesValues<
  GObservables extends IGenericMergeWithNotificationsInObservables,
> = TupleTypes<{
  [GKey in keyof GObservables]: GObservables[GKey] extends IObservable<infer GNotificationUnion>
    ? GNotificationUnion extends INextNotification<infer GValue>
      ? GValue
      : never
    : never;
}>;

export type IMergeWithNotificationsObservableNotifications<
  GObservables extends IGenericMergeWithNotificationsInObservables,
> = IDefaultNotificationsUnion<IMergeWithNotificationsObservablesValues<GObservables>>;
