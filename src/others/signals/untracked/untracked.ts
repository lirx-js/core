import { runOutsideSignalChangesContext } from '../internal/register-signal/signal-get-called';

export function untracked<GReturn>(
  callback: () => GReturn
): GReturn {
  return runOutsideSignalChangesContext<GReturn>(callback);
}
