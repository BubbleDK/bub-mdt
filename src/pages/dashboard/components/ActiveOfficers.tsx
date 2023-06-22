import React from 'react'
import { Avatar, Box, Divider, Group, Text, createStyles } from '@mantine/core'; 
import { useStoreOfficers } from '../../../store/officersStore';
import { useStoreUnit } from '../../../store/unitStore';
import { IconUsers } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '92.5%',
    padding: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    },
  },
}));

const ActiveOfficers = () => {
  const { officers } = useStoreOfficers();
  const { getUnitByOfficer } = useStoreUnit();
  const { classes } = useStyles();
  
  return (
    <div style={{flexGrow: 0.5}}>
      <div style={{backgroundColor: '#222325', height: 845, padding: 15, borderRadius: 5, borderStyle: 'solid', borderColor: '#303236', borderWidth: '0.5px'}}>
        <div style={{display: 'flex', gap: 10}}>
          <IconUsers stroke={1.5} size='1.5rem' color='white' />  
          <Text style={{fontSize: 18, color: 'white'}} weight={500}>
            Active Officers ({officers.length})
          </Text>
        </div>

        <Divider style={{marginTop: 10, marginBottom: 10}} />

        {officers.map((officer, index) => (
          <div key={index}>
            <div className={classes.user}>
              <Group>
                <Avatar src={officer.image} radius="md" />

                <div style={{ flex: 1 }}>
                  <Text size="sm" weight={500}>
                    {officer.firstname} {officer.lastname} ({officer.callsign})
                  </Text>

                  <Text color="dimmed" size="xs">
                    {officer.role}
                  </Text>
                </div>

                <Text size="xs" weight={500}>
                  Unit: {getUnitByOfficer(officer.citizenid) ? getUnitByOfficer(officer.citizenid)?.unitName : 'None'}
                </Text>
              </Group>
            </div>
            {index < officers.length - 1 && <Divider />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActiveOfficers