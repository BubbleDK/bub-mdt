import React from 'react'
import { Button, Group, Text, TextInput, createStyles } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useStoreOfficers } from '../../store/officersStore';
import RosterTable from './components/RosterTable';

const useStyles = createStyles((theme) => ({
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    padding: 50,
  },

  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
  }
}))

const Roster = () => {
  const { classes, cx } = useStyles();
  const { officers } = useStoreOfficers();

  return (
    <div className={classes.dashboard}>
      <div className={classes.topbar}>
        <div>
          <Text style={{fontSize: 12}} weight={500} c="dimmed">
            Manage roster here
          </Text>

          <Text style={{fontSize: 24, color: 'white'}} weight={500}>
            Roster
          </Text>
        </div>
        <div style={{display: 'flex', gap: 15, alignItems: 'center'}}>
          <Text style={{fontSize: 13, textAlign: 'center'}} weight={500} c="dimmed">
            {officers.length} members
          </Text>

          <TextInput
            placeholder="Search..."
            variant="filled"
          />
          <Button leftIcon={<IconPlus />} style={{backgroundColor: 'rgba(51, 124, 255, 0.2)', color: 'rgba(159, 194, 255, 1)'}}>
            Add member
          </Button>
        </div>
      </div>

      <RosterTable />
    </div>
  )
}

export default Roster;