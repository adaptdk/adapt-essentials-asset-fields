import {
  TableCell,
  RelativeDateTime,
  Text,
  Flex,
  SkeletonContainer,
  SkeletonDisplayText,
  SkeletonBodyText,
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
  colSpan?: number;
  loading?: boolean;
}

export const BodyInputCellResolver = ({
  column,
  asset,
  loading = false,
  ...rest
}: BodyInputCellResolverProps) => {
  const { enabledLocales } = useLocales();
  const user = useUser(asset.sys.updatedBy.sys.id);

  if (loading && column !== 'status')
    return (
      <TableCell key={column} {...rest}>
        <SkeletonContainer style={{ height: '60px' }}>
          <SkeletonBodyText numberOfLines={2} />
        </SkeletonContainer>
      </TableCell>
    );

  switch (column) {
    case 'title':
      return (
        <TableCell key={column} {...rest}>
          <AssetInputFieldText
            asset={asset}
            locales={enabledLocales}
            field={'title'}
          />
        </TableCell>
      );
    case 'description':
      return (
        <TableCell key={column} {...rest}>
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
        <TableCell key={column} {...rest}>
          <AssetInputFieldText
            asset={asset}
            locales={enabledLocales}
            field={'fileName'}
          />
        </TableCell>
      );

    case 'updatedAt':
      return (
        <TableCell key={column} {...rest}>
          <RelativeDateTime date={asset.sys.updatedAt} />
        </TableCell>
      );
    case 'updatedBy':
      return (
        <TableCell key={column} {...rest}>
          <Flex gap="spacingXs" alignItems="center">
            {user.avatarUrl && <Avatar src={user.avatarUrl} size="tiny" />}
            <Text fontColor="gray900">
              {user.firstName} {user.lastName}
            </Text>
          </Flex>
        </TableCell>
      );
    case 'status':
      return (
        <TableCell key={column} style={{ width: '50px', maxWidth: "50px" }} {...rest}>
          {!loading && <EntryStatus sys={asset.sys} />}
          {loading && (
            <SkeletonContainer style={{ height: '60px' }}>
              <SkeletonDisplayText />
            </SkeletonContainer>
          )}
        </TableCell>
      );
    default:
      return null;
  }
};
