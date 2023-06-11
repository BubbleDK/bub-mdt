import React, { useState } from 'react'
import { ActionIcon, Group, Paper, Tooltip, Text, createStyles, Divider, Badge, Checkbox, Select, rem, Modal } from '@mantine/core'
import { IconChevronDown, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import { useStoreIncidents } from '../../../store/incidentsStore';
import { useStoreProfiles } from '../../../store/profilesStore';
import InvolvedCriminals from './InvolvedCriminals';

const useStyles = createStyles((theme) => ({
	action: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    }),
  },
}));

const CriminalsRow = () => {
  const { classes } = useStyles();
  const { selectedIncident } = useStoreIncidents();

  return (
    <Paper p='md' withBorder style={{width: 450, backgroundColor: 'rgb(34, 35, 37)'}}>
      <Group position='apart'>
        <Text weight={500} c={'white'}>Involved Criminals</Text>
        <Tooltip label='Add criminal' withArrow color='dark' position='bottom'>
          <ActionIcon className={classes.action} onClick={() => { }}>
            <IconPlus size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Divider my='sm' />

      {selectedIncident && selectedIncident.involvedCriminals.map((criminal) => (
        <InvolvedCriminals criminal={criminal} />
      ))}
    </Paper>
  )
}

export default CriminalsRow