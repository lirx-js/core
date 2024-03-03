import { IProgress } from '../../../progress/progress.type';
import { isNotification } from '../../is-notification';
import { UPLOAD_PROGRESS_NOTIFICATION_NAME } from './upload-progress-notification-name.constant';
import { IUploadProgressNotification } from './upload-progress-notification.type';

export function isUploadProgressNotification(value: any): value is IUploadProgressNotification {
  return isNotification<'upload-progress', IProgress>(value, UPLOAD_PROGRESS_NOTIFICATION_NAME);
}
