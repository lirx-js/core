import { runOutsideSignalChangesContext } from '../internal/register-signal/signal-get-called.private';

export function untracked<GReturn>(
  callback: () => GReturn,
): GReturn {
  return runOutsideSignalChangesContext<GReturn>(callback);
}
