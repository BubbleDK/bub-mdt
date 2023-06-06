import React, { useState } from 'react';
import { Button, Flex, TextInput, Avatar, UnstyledButton, Group, Text, createStyles, ScrollArea, Paper, rem } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconAdjustments } from '@tabler/icons-react';
import { IncidentData } from '../../../typings';
import { useStoreIncidents } from '../../../store/incidentsStore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

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
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
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

const SearchTableIncidents = (props: {onClick: (data: IncidentData | null) => void}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const { incidents } = useStoreIncidents();
  const { classes } = useStyles();

  return (
    <Paper p='sm' withBorder style={{width: 365}}>
      <Flex gap="xs" justify="flex-start" align="center" direction="row" wrap="wrap" style={{marginBottom: 10}}>
        <TextInput
          placeholder="Search incidents..."
          icon={<IconSearch size={16} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          w={240}
        />
        <Button variant="default" leftIcon={<IconAdjustments size={rem(14)} />}>
          Filter
        </Button>
      </Flex>
      <ScrollArea style={{ height: 820 }}>
        {incidents.map((incident) => (
          <UnstyledButton className={classes.user} onClick={() => { props.onClick(incident); }} key={incident.id}>
            <div className={classes.item}>
              <Group position="apart">
                <Text fz="xs" fw={500} className={classes.name}>
                  {incident.title}
                </Text>

                <Text fz="xs" fw={500} className={classes.name}>
                  Incident Report
                </Text>
              </Group>

              <Group position="apart" style={{marginTop: 5}}>
                <Text fz="xs" fw={500} className={classes.name}>
                  ID: #{incident.id}
                </Text>

                <Text fz="xs" fw={500} className={classes.name}>
                  {incident.createdBy.firstname} {incident.createdBy.lastname} - {dayjs(incident.timeStamp).fromNow().charAt(0).toUpperCase() + dayjs(incident.timeStamp).fromNow().slice(1)}
                </Text>
              </Group>
            </div>
          </UnstyledButton>
        ))}
      </ScrollArea>
    </Paper>
  )
}

export default SearchTableIncidents;