export type ISignalChangeListener = () => void;
export type IOptionalSignalChangeListener = ISignalChangeListener | undefined;

let signalChangeListener: IOptionalSignalChangeListener = undefined;

export function getCurrentSignalChangeListener(): IOptionalSignalChangeListener {
  return signalChangeListener;
}

export function isInSignalContext(): boolean {
  return signalChangeListener !== undefined;
}

export function runSignalChangeContextOnce<GReturn>(
  callback: () => GReturn,
  onChange: ISignalChangeListener,
): GReturn {
  let running: boolean = true;
  return runSignalChangeContext<GReturn>(callback, (): void => {
    if (running) {
      running = false;
      onChange();
    }
  });
}

export function runSignalChangeContext<GReturn>(
  callback: () => GReturn,
  onChange: IOptionalSignalChangeListener,
): GReturn {
  let _signalChangeListener: IOptionalSignalChangeListener = signalChangeListener;
  signalChangeListener = onChange;
  try {
    return callback();
  } finally {
    signalChangeListener = _signalChangeListener;
  }
}

/**
 * Runs a context in which signals are not observed.
 */
export function runOutsideSignalChangeContext<GReturn>(callback: () => GReturn): GReturn {
  return runSignalChangeContext<GReturn>(callback, undefined);
}
