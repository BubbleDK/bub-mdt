import { Paper, Flex, TextInput, Button, rem, ScrollArea, UnstyledButton, Group, createStyles, Text, Select } from '@mantine/core';
import { IconSearch, IconAdjustments } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { useState } from 'react'
import { useStoreIncidents } from '../../../store/incidentsStore';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useStoreEvidence } from '../../../store/evidenceStore';

dayjs.extend(relativeTime)

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '100%',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
  },

  item : {
    marginTop: 5,
    padding: 10,
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

  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

const SearchEvidenceTable = () => {
  const [query, setQuery] = useState('');
  const { evidence } = useStoreEvidence();
  const { classes } = useStyles();

  return (
    <Paper p='sm' withBorder style={{width: 475, backgroundColor: 'rgb(34, 35, 37)'}}>
      <Flex gap="xs" justify="flex-start" align="center" direction="row" wrap="wrap" style={{marginBottom: 10}}>
        <TextInput
          placeholder="Search evidence..."
          icon={<IconSearch size={16} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          w={225}
        />
        <Select
          data={['Testimonial', 'Trace', 'Digital', 'Document', 'Audio', 'Video', 'Photo', 'Other']}
          placeholder="Pick category"
          variant="filled"
          allowDeselect
          w={210}
        />
      </Flex>
      <ScrollArea style={{ height: 820 }}>
        {evidence.slice().sort((a, b) => b.id - a.id).map((evidence) => (
          <UnstyledButton className={classes.user} onClick={() => {  }} key={evidence.id}>
            <div className={classes.item}>
              <Group position="apart">
                <Text fz="sm" weight={600} className={classes.name}>
                  {evidence.title}
                </Text>

                <Text fz="xs" fw={500} className={classes.name}>
                  ID: #{evidence.id}
                </Text>
              </Group>

              <Text fz="xs" fw={500} className={classes.name} mt={5} mb={5}>
                Evidence type: {evidence.type}
              </Text>

              <Group position="apart" style={{marginTop: 5}}>
                <Text fz="xs" fw={500} className={classes.name}>
                  Created by: {evidence.createdBy?.firstname} {evidence.createdBy?.lastname}
                </Text>

                <Text fz="xs" fw={500} className={classes.name}>
                  {dayjs(evidence.timeStamp).fromNow().charAt(0).toUpperCase() + dayjs(evidence.timeStamp).fromNow().slice(1)}
                </Text>
              </Group>
            </div>
          </UnstyledButton>
        ))}
      </ScrollArea>
    </Paper>
  )
}

export default SearchEvidenceTable