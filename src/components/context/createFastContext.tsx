import React, {
  useRef,
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from 'react';
import { AssetProps, UserProps } from "contentful-management";
import { R } from 'vitest/dist/types-2b1c412e.js';

function createFastContext<Store>(initialState: Store) {
  function useStoreData(): {
    get: () => Store;
    set: (value: Partial<Store>) => void;
    subscribe: (callback: () => void) => () => void;
  } {
    const store = useRef(initialState);

    const get = useCallback(() => store.current, []);

    const subscribers = useRef(new Set<() => void>());

    const set = useCallback((value: Partial<Store>) => {
      store.current = { ...store.current, ...value };
      subscribers.current.forEach((callback) => callback());
    }, []);

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return {
      get,
      set,
      subscribe,
    };
  }

  type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

  const StoreContext = createContext<UseStoreDataReturnType | null>(null);

  function Provider({ children }: { children: React.ReactNode }) {
    return (
      <StoreContext.Provider value={useStoreData()}>
        {children}
      </StoreContext.Provider>
    );
  }

  function useStore<SelectorOutput>(
    selector: (store: Store) => SelectorOutput
  ): [SelectorOutput, (value: Partial<Store>) => void] {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error('Store not found');
    }

    const state = useSyncExternalStore(
      store.subscribe,
      () => selector(store.get()),
      () => selector(initialState)
    );

    return [state, store.set];
  }

  return {
    Provider,
    useStore,
  };
}

type StoreType = {
  enabledLocales: string[] | null,
  visibleColumns: string[] | null,
  selectedEntries: string[] | null,
  assetEntries: readonly AssetProps[] | null,
  entriesLoading: boolean,
  users: Record<string, UserProps>,
}

const contextDefaults: StoreType = {
  enabledLocales: null,
  visibleColumns: null,
  selectedEntries: [],
  assetEntries: [],
  entriesLoading: true,
  users: {},
} as const;

type ContextDefaults = typeof contextDefaults;
export type ContextKeys = keyof ContextDefaults;

export const { Provider, useStore } = createFastContext(contextDefaults);
