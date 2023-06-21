import { useEffect, useState } from 'react';

import { ContentType, PageAppSDK } from '@contentful/app-sdk';
import {
  Heading,
  Paragraph,
  Grid,
  Box,
  Table,
  MissingContent,
  EntityStatusBadge,
  Checkbox,
  Button,
  TextInput,
  Textarea,
} from '@contentful/f36-components';
import { Icon } from '@contentful/f36-components';

import Collection from './Collection';
import CollectionList from './CollectionList';
import { useCMA, useSDK } from '@contentful/react-apps-toolkit';
import { SortButton } from './SortButton';

interface DashboardProps {
  contentTypes: ContentType[];
}

interface CollectionsState {
  total: number | null;
  published: number | null;
  scheduled: number | null;
  recent: any[] | null;
}

export default function Dashboard({ contentTypes }: DashboardProps) {
  const sdk = useSDK<PageAppSDK>();
  const cma = useCMA();
  const [data, setData] = useState<CollectionsState>({
    total: null,
    published: null,
    scheduled: null,
    recent: null,
  });

  useEffect(() => {
    async function fetchData() {
      // Fetch some basic statistics.
      const [total, published, scheduled] = await Promise.all([
        cma.entry
          .getMany({})
          .then((entries) => entries.total || 0)
          .catch(() => 0),
        sdk.space
          .getPublishedEntries()
          .then((entries) => entries.total || 0)
          .catch(() => 0),
        cma.scheduledActions
          .getMany({
            environmentId: sdk.ids.environmentAlias ?? sdk.ids.environment,
          })
          .then((actions) => actions.items.length)
          .catch(() => 0),
        ,
      ]);

      setData({ ...data, total, published, scheduled });

      // Fetch some entries were last updated by the current user.
      const recent = await cma.entry
        .getMany({
          query: { 'sys.updatedBy.sys.id': sdk.user.sys.id, limit: 3 },
        })
        .then((resp) => resp.items)
        .catch(() => []);

      // Set the final data. Loading complete.
      setData({ total, published, scheduled, recent });
    }

    fetchData();
  }, []);

  return (
    <Box marginTop="spacingXl">
      {/* <Grid columns="1fr 1fr 1fr" columnGap="spacingM">
        <Collection label="Total entries" value={data.total} />
        <Collection label="Published entries" value={data.published} />
        <Collection label="Scheduled entries" value={data.scheduled} />
      </Grid>

      <Box marginTop="spacingXl">
        <Heading as="h2">Your recent work</Heading>
        <Paragraph>These entries were most recently updated by you.</Paragraph>
        <CollectionList
          contentTypes={contentTypes}
          entries={data.recent}
          onClickItem={(entryId) => sdk.navigator.openEntry(entryId)}
        />
      </Box> */}
      <Box marginTop="spacingXl">
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>
                <Checkbox></Checkbox>
              </Table.Cell>
              <Table.Cell>Title</Table.Cell>
              <Table.Cell>Description</Table.Cell>
              <Table.Cell>Filename</Table.Cell>
              <Table.Cell>
                <SortButton sort="desc">Updated</SortButton>
              </Table.Cell>
              <Table.Cell>By</Table.Cell>
              <Table.Cell>Status</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <Checkbox></Checkbox>
              </Table.Cell>
              <Table.Cell>
                <MissingContent label="No title available" />
              </Table.Cell>
              <Table.Cell>
                <MissingContent label="No description available" />
              </Table.Cell>
              <Table.Cell>
                <MissingContent label="No filename available" />
              </Table.Cell>
              <Table.Cell>August 29, 2018</Table.Cell>
              <Table.Cell>John Doe</Table.Cell>
              <Table.Cell>
                <EntityStatusBadge entityStatus="published" />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Checkbox></Checkbox>
              </Table.Cell>
              <Table.Cell>
                <TextInput value="Phasellus laoreet" />
              </Table.Cell>
              <Table.Cell>
                <Textarea value="Gallia est omnis divisa in partes tres, quarum." rows={1}/>
              </Table.Cell>
              <Table.Cell>
                <TextInput value="laoreet.png" />
              </Table.Cell>
              <Table.Cell>August 29, 2018</Table.Cell>
              <Table.Cell>John Doe</Table.Cell>
              <Table.Cell>
                <EntityStatusBadge entityStatus="published" />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Box>
    </Box>
  );
}
