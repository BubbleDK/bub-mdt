import React, { useState } from 'react';
import { Button, Flex, TextInput, Avatar, UnstyledButton, Group, Text, createStyles, ScrollArea, Paper, rem } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconAdjustments } from '@tabler/icons-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ReportData } from '../../../typings/reports';
import { useStoreReports } from '../../../store/reportsStore';

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

const SearchReports = (props: {onClick: (data: ReportData | null) => void}) => {
  const [query, setQuery] = useState('');
  const { reports } = useStoreReports();
  const { classes } = useStyles();

  return (
    <Paper p='sm' withBorder style={{width: 450, backgroundColor: 'rgb(34, 35, 37)'}}>
      <Flex gap="xs" justify="flex-start" align="center" direction="row" wrap="wrap" style={{marginBottom: 10}}>
        <TextInput
          placeholder="Search reports..."
          icon={<IconSearch size={16} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          w={322}
        />
        <Button variant="default" leftIcon={<IconAdjustments size={rem(14)} />}>
          Filter
        </Button>
      </Flex>
      <ScrollArea style={{ height: 820 }}>
        {reports.map((report) => (
          <UnstyledButton className={classes.user} onClick={() => { props.onClick(report); }} key={report.id}>
            <div className={classes.item}>
              <Group position="apart">
                <Text fz="xs" fw={500} className={classes.name}>
                  {report.title}
                </Text>

                <Text fz="xs" fw={500} className={classes.name}>
                  {report.category}
                </Text>
              </Group>

              <Group position="apart" style={{marginTop: 5}}>
                <Text fz="xs" fw={500} className={classes.name}>
                  ID: #{report.id}
                </Text>

                <Text fz="xs" fw={500} className={classes.name}>
                  {report.createdBy.firstname} {report.createdBy.lastname} - {dayjs(report.timeCreated).fromNow().charAt(0).toUpperCase() + dayjs(report.timeCreated).fromNow().slice(1)}
                </Text>
              </Group>
            </div>
          </UnstyledButton>
        ))}
      </ScrollArea>
    </Paper>
  )
}

export default SearchReports;