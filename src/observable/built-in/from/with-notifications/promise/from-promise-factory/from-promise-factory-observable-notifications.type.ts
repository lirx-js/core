import { IDefaultNotificationsUnion } from '../../../../../../misc/notifications/default-notifications-union.type';
import { IAbortablePromiseOptions } from '@lirx/promise';

export interface IFromPromiseFactoryObservableOptions extends IAbortablePromiseOptions {

}

export interface IFromPromiseFactoryCreatePromiseFunction<GValue> {
  (
    signal: AbortSignal, // INFO potential migration to @lirx/utils
  ): Promise<GValue>;
}

export type IFromPromiseFactoryObservableNotifications<GValue> = IDefaultNotificationsUnion<GValue>;

