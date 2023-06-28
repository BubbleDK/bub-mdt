import { ActionIcon, Avatar, Badge, Button, Checkbox, Group, Modal, ScrollArea, Select, Table, Text, createStyles } from '@mantine/core'
import React, { useState } from 'react'
import { useStoreOfficers } from '../../../store/officersStore';
import { IconPencil, IconUserOff } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

const useStyles = createStyles((theme) => ({
  checkboxInput: {
    '&:checked': {
      backgroundColor: '#337cff',
    },
  }
}));
const rolesData = ['Chief', 'Captain', 'Lieutenant', 'Sergeant', 'Corporal', 'Officer', 'Cadet'];

const RosterTable = () => {
  const { officers, removeOfficer } = useStoreOfficers();
  const { classes } = useStyles();
  const [fireModalOpened, setFireModalOpened] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState('');

  const rosterRow = officers.map((officer) => (
    <tr key={officer.citizenid}>
      <td>
        <Group spacing="sm">
          <Avatar size={40} src={officer.image} radius={5} />
          <div>
            <Text fz="sm" fw={500}>
              {officer.firstname} {officer.lastname}
            </Text>
          </div>
        </Group>
      </td>

      <td>{officer.callsign}</td>

      <td><Checkbox classNames={{input: classes.checkboxInput}} /></td>
      <td><Checkbox classNames={{input: classes.checkboxInput}} /></td>
      <td><Checkbox classNames={{input: classes.checkboxInput}} /></td>
      <td><Checkbox classNames={{input: classes.checkboxInput}} /></td>
      <td><Checkbox classNames={{input: classes.checkboxInput}} /></td>


      <td>{5} days ago</td>

      <td>
        <Select data={rolesData} defaultValue={officer.role} variant="filled" />
      </td>

      <td>
        <Group spacing={0} position="right">
          <ActionIcon>
            <IconPencil size="1rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon color="red" onClick={() => { setFireModalOpened(true); setSelectedOfficer(officer.citizenid) }}>
            <IconUserOff size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  return (
    <>
      <Modal opened={fireModalOpened} onClose={() => setFireModalOpened(false)} size={450} yOffset={350} xOffset={0} title={<Text size="md">Fire officer</Text>}>
        <Text size="sm">
          Are you sure you want to fire this officer? This action cannot be undone.
        </Text>

        <Group position="right">
          <Button color='red' onClick={() => { removeOfficer(selectedOfficer); setFireModalOpened(false); }}>
            Fire officer
          </Button>
        </Group>
      </Modal>
      <ScrollArea h={735}>
        <Table verticalSpacing="sm">
          <thead>
            <tr>
              <th>Officer</th>
              <th>Callsign</th>
              <th>APU</th>
              <th>AIR</th>
              <th>MC</th>
              <th>K9</th>
              <th>FTO</th>
              <th>Last active</th>
              <th>Role</th>
              <th />
            </tr>
          </thead>
          <tbody>{rosterRow}</tbody>
        </Table>
      </ScrollArea>
    </>
  )
}

export default RosterTable