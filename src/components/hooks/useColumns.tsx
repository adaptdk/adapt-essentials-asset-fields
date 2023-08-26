import { useCallback, useMemo } from 'react';
import { PageAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

import { useStore } from '../context/createFastContext';

const defaultColumns = [
  { name: 'title', label: 'Title', isVisible: true },
  { name: 'description', label: 'Description', isVisible: true },
  { name: 'filename', label: 'Filename', isVisible: false },
  { name: 'updatedAt', label: 'Updated', isVisible: false },
  { name: 'updatedBy', label: 'By', isVisible: false },
  { name: 'status', label: 'Status', isVisible: true },
] as const;

type UseColumnsProps = typeof defaultColumns;
export type AvailableColumns = UseColumnsProps[number]['name'];

const useColumns = (columnDescriptor = defaultColumns) => {
  const sdk = useSDK<PageAppSDK>();
  const [_visibleColumns, setVisibleColumns] = useStore(
    (store) => store['visibleColumns']
  );
  const visibleColumns = useMemo(() => {
    const visibleColumnsParam =
      _visibleColumns ??
      sdk.parameters?.instance?.visibleColumns ??
      columnDescriptor
        .filter(({ isVisible }) => isVisible)
        .map(({ name }) => name);
    return visibleColumnsParam;
  }, [_visibleColumns, columnDescriptor, sdk.parameters?.instance?.visibleColumns]);

  const columns = useMemo(
    () => columnDescriptor.map(({ name }) => name),
    [columnDescriptor]
  );
  const columnDetails = useMemo(
    () =>
      columnDescriptor.reduce(
        (acc, { name, ...rest }) => ({
          ...acc,
          [name]: {
            ...rest,
            isVisible: visibleColumns.includes(name),
          },
        }),
        {}
      ),
    [columnDescriptor, visibleColumns]
  );

  const changeColumnVisibility = useCallback(
    (columnName: string, isVisible: boolean) => {
      const newVisibleColumns = isVisible
        // Preserve column order
        ? columns.filter(column => visibleColumns.includes(column) || column === columnName)
        : visibleColumns.filter((name) => name !== columnName);
      setVisibleColumns({ visibleColumns: newVisibleColumns });
    },
    [columnDetails, columns, setVisibleColumns]
  );

  return {
    columns,
    visibleColumns,
    columnDetails,
    changeColumnVisibility,
  };
};

export default useColumns;
