import { runOutsideSignalChangeContext } from '../internal/signal-change-context/signal-change-context.private';

export function untracked<GReturn>(
  callback: () => GReturn,
): GReturn {
  return runOutsideSignalChangeContext<GReturn>(callback);
}
