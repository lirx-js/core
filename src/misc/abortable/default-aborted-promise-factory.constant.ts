import { createAbortError } from '@lirx/utils';

export const DEFAULT_ABORTED_PROMISE_FACTORY = (signal: AbortSignal) => Promise.reject(createAbortError({ signal }));
