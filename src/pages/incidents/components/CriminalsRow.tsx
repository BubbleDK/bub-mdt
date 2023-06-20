import React, { useState } from 'react'
import { ActionIcon, Group, Paper, Tooltip, Text, createStyles, Divider, Modal, TextInput, ScrollArea, UnstyledButton, Avatar } from '@mantine/core'
import { IconChevronRight, IconMan, IconPhoneCall, IconPlus } from '@tabler/icons-react';
import { useStoreIncidents } from '../../../store/incidentsStore';
import { useStoreProfiles } from '../../../store/profilesStore';
import InvolvedCriminal from './InvolvedCriminal';
import { useDisclosure } from '@mantine/hooks';
import { ProfileData } from '../../../typings';

const useStyles = createStyles((theme) => ({
	action: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    }),
  },

  user: {
    display: 'block',
    width: '100%',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
  },

  item : {
    marginTop: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#1d1e20',
    border: `0.1px solid rgb(42, 42, 42, 1)`,

    '&:hover': {
      backgroundColor: '#17181b',
    },
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
  },
}));

const CriminalsRow = () => {
  const { classes } = useStyles();
  const { selectedIncident, addCriminal, newIncident } = useStoreIncidents();
  const [openedInvolvedCriminalsModal, { open, close }] = useDisclosure(false);
  const { profiles, setProfile } = useStoreProfiles();

  const addCriminalToCurrentIncident = (profileCitizenID: string) => {
    addCriminal({ 
      citizenId: profileCitizenID, 
      charges: [], 
      isWarrantForArrestActive: false, 
      final: '', 
      pleadedGuilty: false, 
      processed: false 
    });

    close();
  }

  return (
    <>
      <Modal 
        opened={openedInvolvedCriminalsModal} 
        onClose={close} 
        withCloseButton={false}
        size={550}
        radius={5}
        xOffset={6.5}
      >
        <Divider my="xs" label="Search Criminals" labelPosition="center" />
        <TextInput placeholder="Search Criminals..." mb={5} />
        
        <ScrollArea style={{ height: 500 }}>
          {profiles.map((profile) => (
            <UnstyledButton className={classes.user} onClick={() => { addCriminalToCurrentIncident(profile.citizenid) }} key={profile.citizenid}>
              <Group className={classes.item}>
                <Avatar src={profile.image} size={62} radius={4} />
                <div style={{ flex: 1 }}>
                  <Text fz="sm" fw={500}>
                    Name: {profile.firstname} {profile.lastname}
                  </Text>

                  <Text fz="xs" c="dimmed">
                    ID: {profile.citizenid}
                  </Text>
                </div>

                <IconChevronRight size="0.95rem" stroke={1.5} style={{marginRight: 10}} />
              </Group>
            </UnstyledButton>
          ))}
        </ScrollArea>
      </Modal>

      <Paper p='md' withBorder style={{width: 450, backgroundColor: 'rgb(34, 35, 37)'}}>
        <Group position='apart'>
          <Text weight={500} c={'white'}>Involved Criminals</Text>
          <Tooltip label='Add criminal' withArrow color='dark' position='bottom'>
            <ActionIcon className={classes.action} onClick={open}>
              <IconPlus size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Divider my='sm' />

        {selectedIncident ? (
          selectedIncident.involvedCriminals.map((criminal) => (
            <InvolvedCriminal criminal={criminal} />
          ))
        ) : (
          newIncident.involvedCriminals.map((criminal) => (
            <InvolvedCriminal criminal={criminal} />
          ))
        )}
      </Paper>
    </>
  )
}

export default CriminalsRow