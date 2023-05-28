import { Context } from '../context.class';
import { ISignalWriteMode } from '../../misc/types/signal-write-mode.type';

const SIGNAL_WRITE_MODE_CONTEXT = new Context<ISignalWriteMode>('allow');

/**
 * Returns the mode of a "signal write" in this context.
 */
export function getSignalWriteMode(): ISignalWriteMode {
  return SIGNAL_WRITE_MODE_CONTEXT.get();
}

/**
 * Runs a context in which signal writes are allowed or not.
 */
export function runSignalWriteModeContext<GReturn>(
  value: ISignalWriteMode,
  callback: () => GReturn,
): GReturn {
  return SIGNAL_WRITE_MODE_CONTEXT.run<GReturn>(value, callback);
}
