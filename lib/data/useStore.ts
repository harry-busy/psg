"use client";

import { useSyncExternalStore, useEffect } from "react";
import { store } from "./store";
import type { CollectionName, Collections } from "./types";

/**
 * Reactive collection hook. Any component using it re-renders when the
 * collection changes anywhere in the app (CRM add → Home + Dashboard update).
 */
export function useCollection<K extends CollectionName>(collection: K): Collections[K] {
  useEffect(() => {
    void store.load(collection);
  }, [collection]);

  return useSyncExternalStore(
    (cb) => store.subscribe(collection, cb),
    () => store.peek(collection),
    () => store.peek(collection)
  );
}
