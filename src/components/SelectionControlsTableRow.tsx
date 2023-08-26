import { Table, Box, ButtonGroup, Button, Text } from '@contentful/f36-components';
import useEntriesSelection from './hooks/useEntriesSelection';
import useColumns from './hooks/useColumns';

const SelectionControlsTableRow = () => {
  const { selectedEntries } = useEntriesSelection();
  const { visibleColumns } = useColumns();
  return (
    selectedEntries.at(0) && (
      <Table.Row>
        <Table.Cell colSpan={visibleColumns.length + 2}>
          <Box marginBottom="spacingS">
            <Text>
              {selectedEntries.length} asset
              {selectedEntries.length === 1 ? '' : 's'} selected:
            </Text>
          </Box>
          <ButtonGroup variant="spaced" spacing="spacingM">
            <Button variant="secondary" size="small">
              Unpublish
            </Button>
            <Button variant="positive" size="small">
              Republish
            </Button>
          </ButtonGroup>
        </Table.Cell>
      </Table.Row>
    )
  );
};
export default SelectionControlsTableRow;
