import { useCallback } from "react";
import { useStore } from "../context/createFastContext";

const useAssetEntries = () => {
  const [assetEntries, setStore] = useStore(
    (store) => store['assetEntries']
  );

  const updateAssetEntry = useCallback(
    (assetEntry) => {
      setStore({
        assetEntries: assetEntries.map((existingAssetEntry) =>
          existingAssetEntry.sys.id === assetEntry.sys.id ? assetEntry : existingAssetEntry
        ),
      });
    },
    [assetEntries, setStore]
  );

  const setAssetEntries = useCallback(
    (assetEntries) => {
      setStore({ assetEntries });
    },
    [setStore]
  );

  return {
    assetEntries,
    setAssetEntries,
    updateAssetEntry,
  }
}

export default useAssetEntries;
