import {
  Table,
  TableCell,
  Flex,
  Checkbox,
  Box,
  Skeleton,
} from '@contentful/f36-components';
import { Image } from '@contentful/f36-image';

import { BodyInputCellResolver } from './BodyInputCellResolver';
import useEntriesSelection from './hooks/useEntriesSelection';
import useColumns from './hooks/useColumns';
import useLocales from './hooks/useLocales';
import useAssetEntries from './hooks/useAssetEntries';
import useEntriesLoading from './hooks/useEntriesLoading';

const TableBody = () => {
  const { assetEntries } = useAssetEntries();
  const { entriesLoading } = useEntriesLoading();
  const { selectedEntries, setSelected } = useEntriesSelection();
  const { visibleColumns } = useColumns();
  const { defaultLocale } = useLocales();

  return (
    <Table.Body>
      {!entriesLoading &&
        assetEntries.map((asset) => (
          <Table.Row key={asset.sys.id}>
            <TableCell style={{ width: '120px' }}>
              <Flex alignItems="center">
                <Checkbox
                  isChecked={selectedEntries.includes(asset.sys.id)}
                  onChange={(event) =>
                    setSelected(asset.sys.id, event?.target?.checked)
                  }
                />
                <Box margin="spacing2Xs">
                  <Image
                    alt={asset.fields.title?.[defaultLocale]}
                    height="60px"
                    width="60px"
                    style={{ borderRadius: '4px' }}
                    src={`${asset.fields.file?.[defaultLocale].url}?w=60&h=60&fit=thumb`}
                  />
                </Box>
              </Flex>
            </TableCell>
            {visibleColumns.map((column) => (
              <BodyInputCellResolver
                key={column}
                column={column}
                asset={asset}
              />
            ))}
            <TableCell style={{ width: '50px' }} />
          </Table.Row>
        ))}
      {entriesLoading && (
        <Skeleton.Row rowCount={5} columnCount={visibleColumns.length + 1} />
      )}
    </Table.Body>
  );
};

export default TableBody;
