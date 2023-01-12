import { IProgress } from '../../../progress/progress.type';
import { INotification } from '../../notification.type';

export type IUploadProgressNotification = INotification<'upload-progress', IProgress>;
