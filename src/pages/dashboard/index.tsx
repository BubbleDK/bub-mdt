import React from 'react';
import { createStyles, Divider, Text, Group, rem, UnstyledButton } from '@mantine/core';
import { IconCalendar, IconSearch, IconUsers } from "@tabler/icons-react";
import RecentActivity from './components/RecentActivity';
import ActiveOfficers from './components/ActiveOfficers';
import Announcements from './components/Announcements';
import { useStorePersonal } from '../../store/personalInfoStore';

const useStyles = createStyles((theme) => ({
  dashboard: {
    display: 'flex',
    padding: `calc(${theme.spacing.md} * 1.5)`,
  },
  root: {
    width: rem(300),
    height: rem(34),
    paddingLeft: theme.spacing.lg,
    paddingRight: rem(5),
    borderRadius: theme.radius.xs,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[5],
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors.dark[5], 0.85)
          : theme.fn.rgba(theme.colors.gray[0], 0.35),
    },
  },

  shortcut: {
    fontSize: rem(11),
    lineHeight: 1,
    padding: `${rem(4)} ${rem(7)}`,
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]
    }`,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
  },
}));

const Dashboard = () => {
  const { classes, cx } = useStyles();
  const { firstname, lastname } = useStorePersonal();
  return (
		<div className={classes.dashboard}>
      <div style={{flexGrow: 3, width: 870}}>
        <Group position="apart">
          <div>
            <Text style={{fontSize: 24, color: 'white'}} weight={500}>
              Welcome back, <span>{firstname} {lastname}</span>
            </Text>
            <Text color="dimmed" size="xs" style={{display: 'flex', gap: 10}}>
              <IconCalendar size={rem(18)} /> <Text color="dimmed" size={14}>{new Date().toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
            </Text>
          </div>
          <UnstyledButton className={cx(classes.root)}>
            <Group spacing="xs">
              <IconSearch size={rem(14)} stroke={1.5} />
              <Text size="sm" color="dimmed" pr={110}>
                Search
              </Text>
              <Text weight={700} className={classes.shortcut}>
                CTRL + F
              </Text>
            </Group>
          </UnstyledButton>
        </Group>

        <Divider style={{marginTop: 20, marginBottom: 20}} />

        <RecentActivity />

        <Announcements />
      </div>

      <Divider orientation="vertical" style={{marginLeft: 20, marginRight: 20}} />

      <ActiveOfficers />
		</div>
	);
}

export default Dashboard;