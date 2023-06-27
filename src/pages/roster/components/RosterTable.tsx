import { ActionIcon, Avatar, Badge, Checkbox, Group, ScrollArea, Select, Table, Text, createStyles } from '@mantine/core'
import React from 'react'
import { useStoreOfficers } from '../../../store/officersStore';
import { IconPencil, IconUserOff } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  checkboxInput: {
    '&:checked': {
      backgroundColor: '#337cff',
    },
  }
}));
const rolesData = ['Chief', 'Captain', 'Lieutenant', 'Sergeant', 'Corporal', 'Officer', 'Cadet'];

const RosterTable = () => {
  const { officers } = useStoreOfficers();
  const { classes } = useStyles();

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
      <td><Checkbox /></td>
      <td><Checkbox /></td>
      <td><Checkbox /></td>
      <td><Checkbox /></td>


      <td>{Math.floor(Math.random() * 6 + 5)} days ago</td>

      <td>
        <Select data={rolesData} defaultValue={officer.role} variant="filled" />
      </td>

      <td>
        <Group spacing={0} position="right">
          <ActionIcon>
            <IconPencil size="1rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon color="red">
            <IconUserOff size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  return (
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
  )
}

export default RosterTable