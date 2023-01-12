import { IProgress } from '../../../progress/progress.type';
import { INotification } from '../../notification.type';

export type IDownloadProgressNotification = INotification<'download-progress', IProgress>;
