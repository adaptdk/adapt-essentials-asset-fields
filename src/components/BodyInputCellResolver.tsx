import {
  TableCell,
  RelativeDateTime,
  Text,
  Flex,
} from '@contentful/f36-components';
import { AssetProps } from 'contentful-management/dist/typings/entities/asset';
import { Avatar } from '@contentful/f36-avatar';

import { AssetInputFieldText } from './AssetInputFieldText';
import { EntryStatus } from './EntryStatus';
import useLocales from './hooks/useLocales';
import { AvailableColumns } from './hooks/useColumns';
import useUser from './hooks/useUser';

interface BodyInputCellResolverProps {
  column: AvailableColumns;
  asset: AssetProps;
}

export const BodyInputCellResolver = ({
  column,
  asset,
}: BodyInputCellResolverProps) => {
  const { enabledLocales } = useLocales();
  const user = useUser(asset.sys.updatedBy.sys.id);

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
      return (
        <TableCell key={column}>
          <Flex gap="spacingXs" alignItems="center">
            <Avatar src={user.avatarUrl} size="tiny" />
            <Text fontColor="gray900">
              {user.firstName} {user.lastName}
            </Text>
          </Flex>
        </TableCell>
      );
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
