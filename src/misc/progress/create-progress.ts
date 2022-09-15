import { IProgress } from './progress.type';

export function createProgress(
  loaded: number,
  total: number,
): IProgress {
  return {
    loaded,
    total,
  };
}

