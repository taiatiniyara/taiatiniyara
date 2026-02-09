// Shim for use-sync-external-store/with-selector to use React 19's built-in hooks
import { useSyncExternalStore } from 'react';

export function useSyncExternalStoreWithSelector<Snapshot, Selection>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => Snapshot,
  getServerSnapshot: undefined | null | (() => Snapshot),
  selector: (snapshot: Snapshot) => Selection,
  _isEqual?: (a: Selection, b: Selection) => boolean
): Selection {
  // Simple implementation using React 19's useSyncExternalStore
  const serverSnapshot = getServerSnapshot ?? undefined;
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
  return selector(snapshot);
}

export { useSyncExternalStore };
