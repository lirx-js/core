import { freeze } from '../../../helpers/freeze';
import { ICompleteNotification } from './complete-notification.type';
import { createCompleteNotification } from './create-complete-notification';

export const STATIC_COMPLETE_NOTIFICATION: ICompleteNotification = freeze(createCompleteNotification());
