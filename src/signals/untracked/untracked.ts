import { runInReactiveConsumerContext } from '../internal/reactive-context.private';

export function untracked<GReturn>(callback: () => GReturn): GReturn {
  return runInReactiveConsumerContext<GReturn>(undefined, callback);
}
