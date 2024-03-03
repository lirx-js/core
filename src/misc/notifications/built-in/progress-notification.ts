import { createProgress } from '../../progress/create-progress';
import { IProgress } from '../../progress/progress.type';
import { createNotification } from '../create-notification';
import { INotification } from '../notification.type';

export type IProgressNotification = INotification<'progress', IProgress>;

export function createProgressNotification(progress: IProgress): IProgressNotification {
  return createNotification<'progress', IProgress>('progress', progress);
}

export function createBasicProgressNotification(
  loaded: number,
  total: number,
): IProgressNotification {
  return createNotification<'progress', IProgress>('progress', createProgress(loaded, total));
}
