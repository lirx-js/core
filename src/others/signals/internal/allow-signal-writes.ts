let ALLOW_SIGNAL_WRITES: boolean = true;

export function isSignalWritesAllowed(): boolean {
  return ALLOW_SIGNAL_WRITES;
}

export function runAllowSignalWritesContext<GReturn>(
  contextFunction: () => GReturn,
  allowed: boolean,
): GReturn {
  const currentAllowSignalWrites: boolean = ALLOW_SIGNAL_WRITES;
  ALLOW_SIGNAL_WRITES = allowed;
  try {
    return contextFunction();
  } finally {
    ALLOW_SIGNAL_WRITES = currentAllowSignalWrites;
  }
}
