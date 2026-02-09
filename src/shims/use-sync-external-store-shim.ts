// Shim for use-sync-external-store to use React 19's built-in hooks
import { useSyncExternalStore } from 'react';

export { useSyncExternalStore };
export default useSyncExternalStore;
