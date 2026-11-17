import { runInWatcherContext } from '../internal/reactive-context.private';

export function untracked<GReturn>(callback: () => GReturn): GReturn {
  return runInWatcherContext<GReturn>(undefined, callback);
}
