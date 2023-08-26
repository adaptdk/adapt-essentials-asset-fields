import { TableCell, RelativeDateTime } from '@contentful/f36-components';
import { AssetProps } from 'contentful-management/dist/typings/entities/asset';

import { AssetInputFieldText } from './AssetInputFieldText';
import { EntryStatus } from './EntryStatus';
import useLocales from './hooks/useLocales';
import { AvailableColumns } from './hooks/useColumns';

interface BodyInputCellResolverProps {
  column: AvailableColumns;
  asset: AssetProps;
}

export const BodyInputCellResolver = ({column, asset}:BodyInputCellResolverProps) => {
  const { enabledLocales } = useLocales();
  switch (column) {
    case 'title':
      return (
        <TableCell key={column}>
          <AssetInputFieldText
            asset={asset}
            locales={enabledLocales}
            field={'title'}
          />
        </TableCell>
      );
    case 'description':
      return (
        <TableCell key={column}>
          <AssetInputFieldText
            as={'Textarea'}
            rows={1}
            asset={asset}
            locales={enabledLocales}
            field={'description'}
          />
        </TableCell>
      );
    case 'filename':
      return (
        <TableCell key={column}>
          <AssetInputFieldText
            asset={asset}
            locales={enabledLocales}
            field={'fileName'}
          />
        </TableCell>
      );

    case 'updatedAt':
      return (
        <TableCell key={column}>
          <RelativeDateTime date={asset.sys.updatedAt} />
        </TableCell>
      );
    case 'updatedBy':
      return <TableCell key={column}>{asset.sys.updatedBy.sys.id}</TableCell>;
    case 'status':
      return (
        <TableCell key={column} style={{ width: '50px' }}>
          <EntryStatus sys={asset.sys} />
          {/* <Spinner /> */}
        </TableCell>
      );
    default:
      return null;
  }
};
