import { useEffect, useReducer, useState, useMemo } from 'react';
import { ContentEntitySys, ContentType, PageAppSDK } from '@contentful/app-sdk';
import {
  Box,
  Table,
  EntityStatusBadge,
  Checkbox,
  TextInput,
  Textarea,
  Pagination,
  Flex,
  IconButton,
  Popover,
  Stack,
  Switch,
} from '@contentful/f36-components';
import FocusLock from 'react-focus-lock';
import {
  SettingsTrimmedIcon,
  MoreHorizontalTrimmedIcon,
  DragTrimmedIcon,
} from '@contentful/f36-icons';
import { Image } from '@contentful/f36-image';

import { useCMA, useSDK } from '@contentful/react-apps-toolkit';
import { SortButton } from './SortButton';
import { AssetFieldText } from './AssetFieldText';

interface DashboardProps {
  contentTypes: ContentType[];
  settings: {
    autoUpdate?: boolean;
  };
}
function getEntryStatus(entrySys: ContentEntitySys) {
  if (entrySys.archivedVersion) {
    return 'archived';
  } else if (
    !!entrySys.publishedVersion &&
    entrySys.version == entrySys.publishedVersion + 1
  ) {
    return 'published';
  } else if (
    !!entrySys.publishedVersion &&
    entrySys.version >= entrySys.publishedVersion + 2
  ) {
    return 'changed';
  }
  return 'draft';
}

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 3;
const DEFAULT_ORDER = 'desc';

export default function Dashboard({
  contentTypes,
  settings: { autoUpdate = false },
}: DashboardProps) {
  const [skip, setSkip] = useState(DEFAULT_SKIP);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [total, setTotal] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>(DEFAULT_ORDER);
  const [activePage, setActivePage] = useState(0);
  const [isOpenColumnsPopup, setIsOpenColumnsPopup] = useState(false);
  const [recentAssets, setRecentAssets] = useState([]);
  const [columns, updateColumns] = useReducer(
    (state, action) => {
      const { key, ...rest } = action;
      const newState = structuredClone(state);
      newState[key] = { ...state[key], ...rest };
      return newState;
    },
    {
      title: { enabled: true, order: 0, title: 'Title' },
      description: { enabled: true, order: 1, title: 'Description' },
      filename: { enabled: true, order: 2, title: 'Filename' },
      updated: { enabled: true, order: 3, title: 'Updated' },
      by: { enabled: true, order: 4, title: 'By' },
      status: { enabled: true, order: 5, title: 'Status' },
    }
  );
  const sdk = useSDK<PageAppSDK>();
  const cma = useCMA();

  useEffect(() => {
    setSkip(activePage * limit);
  }, [activePage, limit]);

  useEffect(() => {
    async function fetchData() {
      // Fetch some entries were last updated by the current user.
      const recentAssets = await cma.asset.getMany({
        query: {
          skip,
          limit,
          // order: '-sys.updatedAt',
          order: '-sys.id',
        },
      });
      setTotal(recentAssets.total);
      setRecentAssets(recentAssets.items);
    }

    fetchData();
  }, [skip, limit]);

  const sortedColumns = useMemo(
    () =>
      Object.entries(columns).sort(
        ([, { order: a }], [, { order: b }]) => a - b
      ),
    [columns]
  );

  const enabledColumns = useMemo(
    () => sortedColumns.filter(([, { enabled }]) => enabled),
    [sortedColumns]
  );

  return (
    <Box marginTop="spacingXl">
      <Box marginTop="spacingXl">
        <Table>
          <Table.Head>
            <Table.Row>
              {!autoUpdate && (
                <Table.Cell style={{ verticalAlign: 'bottom' }}>
                  <Checkbox></Checkbox>
                </Table.Cell>
              )}
              {enabledColumns.map(([key, { title }]) => {
                switch (key) {
                  case 'updated':
                    return (
                      <Table.Cell key={key}>
                        <SortButton sort={order}>{title}</SortButton>
                      </Table.Cell>
                    );
                  default:
                    return title && <Table.Cell key={key}>{title}</Table.Cell>;
                }
              })}

              <Table.Cell>
                <Popover
                  isOpen={isOpenColumnsPopup}
                  onClose={() => setIsOpenColumnsPopup(false)}
                >
                  <Popover.Trigger>
                    <IconButton
                      onClick={() => setIsOpenColumnsPopup(!isOpenColumnsPopup)}
                      variant="transparent"
                      size="small"
                      aria-label="Select columns to show"
                      icon={<SettingsTrimmedIcon size="tiny" />}
                    />
                  </Popover.Trigger>
                  <Popover.Content>
                    <FocusLock>
                      <Stack
                        padding="spacingM"
                        margin="none"
                        spacing="spacingS"
                        flexDirection="column"
                      >
                        {sortedColumns.map(([key, { enabled, title }]) => (
                            <IconButton
                            key={key}
                            isFullWidth
                              style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                cursor: 'grab',
                                _hover: {
                                  cursor: 'grabbing',
                                },
                              }}
                              variant="transparent"
                              size="small"
                              icon={<DragTrimmedIcon />}
                            >
                              <Switch
                                size="small"
                                isChecked={enabled}
                                onClick={(event) =>
                                  updateColumns({
                                    key,
                                    enabled: !!event.target.checked,
                                  })
                                }
                              >
                                {title}
                              </Switch>
                            </IconButton>
                        ))}
                      </Stack>
                    </FocusLock>
                  </Popover.Content>
                </Popover>
              </Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {recentAssets.map((asset) => (
              <Table.Row key={asset.sys.id}>
                {/* <pre>{JSON.stringify(asset, null, 2)}</pre> */}
                {!autoUpdate && (
                  <Table.Cell>
                    <Checkbox></Checkbox>
                  </Table.Cell>
                )}
                {enabledColumns.map(([key]) => {
                  switch (key) {
                    case 'title':
                      return (
                        <Table.Cell key={key}>
                          <Flex>
                            <Box margin="spacing2Xs">
                              <Image
                                alt='An image saying "Everyone is welcome here"'
                                height="60px"
                                width="60px"
                                src={
                                  asset.fields.file?.[sdk.locales.default].url
                                }
                              />
                            </Box>
                            <AssetFieldText asset={asset} locale={sdk.locales.default} field={'title'} />
                          </Flex>
                        </Table.Cell>
                      );
                    case 'description':
                      return (
                        <Table.Cell key={key}>
                          {/* <Textarea
                            value={
                              asset.fields.description?.[sdk.locales.default]
                            }
                            rows={1}
                          /> */}
                          <AssetFieldText asset={asset} locale={sdk.locales.default} field={'description'} />
                        </Table.Cell>
                      );
                    case 'filename':
                      return (
                        <Table.Cell key={key}>
                          <AssetFieldText asset={asset} locale={sdk.locales.default} field={'fileName'} />
                        </Table.Cell>
                      );

                    case 'updated':
                      return (
                        <Table.Cell key={key}>{asset.sys.updatedAt}</Table.Cell>
                      );
                    case 'by':
                      return (
                        <Table.Cell key={key}>
                          {asset.sys.updatedBy.sys.id}
                        </Table.Cell>
                      );
                    case 'status':
                      return (
                        <Table.Cell key={key}>
                          <EntityStatusBadge
                            entityStatus={getEntryStatus(asset.sys)}
                          />
                        </Table.Cell>
                      );
                    default:
                      return null;
                  }
                })}
                <Table.Cell>
                  <IconButton
                    variant="transparent"
                    size="small"
                    aria-label="Select other entry actions"
                    icon={<MoreHorizontalTrimmedIcon size="tiny" />}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Box marginTop="spacingXl" />
        <Pagination
          activePage={activePage}
          onPageChange={setActivePage}
          isLastPage={total <= activePage * limit}
          pageLength={recentAssets.length}
          itemsPerPage={limit}
          totalItems={total}
        />
      </Box>
    </Box>
  );
}
