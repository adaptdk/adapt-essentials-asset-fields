import { Pagination } from '@contentful/f36-components';
import { useCMA } from '@contentful/react-apps-toolkit';
import { useEffect, useState } from 'react';
import useEntriesSelection from './hooks/useEntriesSelection';
import useAssetEntries from './hooks/useAssetEntries';
import useEntriesLoading from './hooks/useEntriesLoading';

const DEFAULT_LIMIT = 10;

const Paginator = () => {
  const { setIsLoading } = useEntriesLoading();
  const [total, setTotal] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const [skip, setSkip] = useState(0);
  const { assetEntries, setAssetEntries } = useAssetEntries();
  const { setSelectedEntries } = useEntriesSelection();
  const { selectedEntries } = useEntriesSelection();
  const cma = useCMA();

  useEffect(() => {
    setIsLoading(true);
    setSkip(activePage * DEFAULT_LIMIT);
  }, [activePage]);

  useEffect(() => {
    async function fetchData() {
      // Fetch some entries were last updated by the current user.
      const assetResponse = await cma.asset.getMany({
        query: {
          skip,
          limit: DEFAULT_LIMIT,
          // order: '-sys.updatedAt',
          order: '-sys.id',
        },
      });
      setTotal(assetResponse.total);
      setAssetEntries(assetResponse.items);
      setIsLoading(false);
    }
    fetchData();
  }, [cma.asset, setAssetEntries, skip]);

  const pageChangeHandler = (activePage) => {
    setActivePage(activePage);
    setSelectedEntries([]);
  };

  return (
    selectedEntries.length < 1 && (
    <Pagination
      activePage={activePage}
      onPageChange={pageChangeHandler}
      isLastPage={total <= activePage * DEFAULT_LIMIT}
      pageLength={assetEntries.length}
      itemsPerPage={DEFAULT_LIMIT}
      totalItems={total}
    />)
  );
};

export default Paginator;
