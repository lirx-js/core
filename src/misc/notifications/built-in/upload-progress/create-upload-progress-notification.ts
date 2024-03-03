import { IProgress } from '../../../progress/progress.type';
import { createNotification } from '../../create-notification';
import { UPLOAD_PROGRESS_NOTIFICATION_NAME } from './upload-progress-notification-name.constant';
import { IUploadProgressNotification } from './upload-progress-notification.type';

export function createUploadProgressNotification(progress: IProgress): IUploadProgressNotification {
  return createNotification<'upload-progress', IProgress>(
    UPLOAD_PROGRESS_NOTIFICATION_NAME,
    progress,
  );
}
