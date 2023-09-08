import { useMemo, useState } from 'react';
import {
  Table,
  Box,
  ButtonGroup,
  Button,
  Text,
  Spinner,
  Flex,
} from '@contentful/f36-components';
import useEntriesSelection from './hooks/useEntriesSelection';
import useColumns from './hooks/useColumns';
import useAssetEntries from './hooks/useAssetEntries';
import { EntryStatus, getEntryStatus } from './utils/entries';
import { useCMA } from '@contentful/react-apps-toolkit';

const SelectionControlsTableRow = () => {
  const cma = useCMA();
  const [performingAction, setPerformingAction] = useState(null);
  const { selectedEntries, setSelectedEntries } = useEntriesSelection();
  const { visibleColumns } = useColumns();
  const { assetEntries, setAssetEntries, updateAssetEntries } = useAssetEntries();
  const selectedAssets = useMemo(
    () =>
      selectedEntries?.map((id) =>
        assetEntries.find((assetEntry) => assetEntry.sys.id === id)
      ) || [],
    [assetEntries, selectedEntries]
  );

  const deletableAssets = useMemo(() => {
    return selectedAssets.filter(
      (assetEntry) =>
        getEntryStatus(assetEntry.sys) === EntryStatus.ARCHIVED ||
        getEntryStatus(assetEntry.sys) === EntryStatus.DRAFT
    );
  }, [selectedAssets]);

  const unpublishableAssets = useMemo(() => {
    return selectedAssets.filter(
      (assetEntry) =>
        getEntryStatus(assetEntry.sys) === EntryStatus.PUBLISHED ||
        getEntryStatus(assetEntry.sys) === EntryStatus.CHANGED
    );
  }, [selectedAssets]);

  const republishableAssets = useMemo(() => {
    return selectedAssets.filter(
      (assetEntry) =>
        getEntryStatus(assetEntry.sys) === EntryStatus.CHANGED ||
        getEntryStatus(assetEntry.sys) === EntryStatus.DRAFT
    );
  }, [selectedAssets]);

  const publishableAssets = useMemo(() => {
    return selectedAssets.filter(
      (assetEntry) => getEntryStatus(assetEntry.sys) === EntryStatus.DRAFT
    );
  }, [selectedAssets]);

  const archivableAssets = useMemo(() => {
    return selectedAssets.filter(
      (assetEntry) => getEntryStatus(assetEntry.sys) === EntryStatus.DRAFT
    );
  }, [selectedAssets]);

  const unarchivableAssets = useMemo(() => {
    return selectedAssets.filter(
      (assetEntry) => getEntryStatus(assetEntry.sys) === EntryStatus.ARCHIVED
    );
  }, [selectedAssets]);

  const clearSelection = () => setSelectedEntries([]);

  const actionMap = {
    publish: {
      actionLabel: 'Publishing...',
      cma: cma.asset.publish,
    },
    delete: {
      actionLabel: 'Deleting...',
      cma: cma.asset.delete,
    },
    archive: {
      actionLabel: 'Archiving...',
      cma: cma.asset.archive,
    },
    unpublish: {
      actionLabel: 'Unpublishing...',
      cma: cma.asset.unpublish,
    },
    republish: {
      actionLabel: 'Republishing...',
      cma: cma.asset.publish,
    },
    unarchive: {
      actionLabel: 'Unarchiving...',
      cma: cma.asset.unarchive,
    },
  };

  const performSelectionAction = (actionKey, collection) => () => {
    setPerformingAction(actionMap[actionKey].actionLabel);
    Promise.all(
      collection.map((assetEntry) =>
        actionMap[actionKey].cma({ assetId: assetEntry.sys.id }, assetEntry)
      )
    )
      .then(updatedEntries => {
        if (actionKey === 'delete') {
          setSelectedEntries([])
          setAssetEntries(assetEntries.filter((assetEntry) => !collection.includes(assetEntry)));
          return;
        }
        updateAssetEntries(updatedEntries);
      })
      .then(() => {
        setPerformingAction(null);
        clearSelection();
      });
  };

  return (
    selectedEntries.at(0) && (
      <Table.Row>
        <Table.Cell colSpan={visibleColumns.length + 2}>
          <Box marginBottom="spacingS">
            <Text>
              {selectedEntries.length} asset
              {selectedEntries.at(1) ? 's' : ''} selected:
            </Text>
          </Box>
          {!performingAction && (
            <ButtonGroup variant="spaced" spacing="spacingM">
              {deletableAssets.at(0) &&
                selectedAssets.length === deletableAssets.length && (
                  <Button
                    variant="negative"
                    size="small"
                    onClick={performSelectionAction('delete', selectedAssets)}
                  >
                    Delete
                  </Button>
                )}

              {archivableAssets.at(0) &&
                selectedAssets.length === archivableAssets.length && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={performSelectionAction('archive', selectedAssets)}
                  >
                    Archive
                  </Button>
                )}

              {unpublishableAssets.at(0) &&
                selectedAssets.length === unpublishableAssets.length && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={performSelectionAction('unpublish', selectedAssets)}
                  >
                    Unpublish
                  </Button>
                )}
              {republishableAssets.at(0) &&
                selectedAssets.length === republishableAssets.length &&
                publishableAssets.length !== republishableAssets.length && (
                  <Button
                    variant="positive"
                    size="small"
                    onClick={performSelectionAction('republish', selectedAssets)}
                  >
                    Republish
                  </Button>
                )}

              {publishableAssets.at(0) &&
                selectedAssets.length === publishableAssets.length && (
                  <Button
                    variant="positive"
                    size="small"
                    onClick={performSelectionAction(
                      'publish',
                      publishableAssets
                    )}
                  >
                    Publish
                  </Button>
                )}
              {unarchivableAssets.at(0) &&
                selectedAssets.length === unarchivableAssets.length && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={performSelectionAction(
                      'unarchive',
                      unarchivableAssets
                    )}
                  >
                    Unarchive
                  </Button>
                )}
            </ButtonGroup>
          )}
          {performingAction && (
            <Flex gap="spacing2Xs" alignItems="baseline">
              <Text>{performingAction}</Text>
              <Spinner />
            </Flex>
          )}
        </Table.Cell>
      </Table.Row>
    )
  );
};
export default SelectionControlsTableRow;
