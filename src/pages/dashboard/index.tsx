import React from 'react';
import { Box, createStyles, Divider, Flex, Paper, Text, Title, Group, ActionIcon, Button, rem, UnstyledButton } from '@mantine/core';
import DashboardStats from './components/DashboardStats';
import { DataTable } from 'mantine-datatable';
import { IconEye, IconEdit, IconTrash, IconCalendar, IconSearch } from "@tabler/icons-react";
import RecentActivity from './components/RecentActivity';
import QuoteAndBulletinBoard from './components/QuoteAndBulletinBoard';
import ActiveOfficers from './components/ActiveOfficers';

const useStyles = createStyles((theme) => ({
  dashboard: {
    display: 'flex',
    padding: `calc(${theme.spacing.md} * 1.5)`,
  },
  root: {
    width: rem(250),
    height: rem(34),
    paddingLeft: theme.spacing.lg,
    paddingRight: rem(5),
    borderRadius: theme.radius.md,
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
  return (
		<div className={classes.dashboard}>
      <div style={{flexGrow: 2}}>
        <Group position="apart">
          <div>
            <Text style={{fontSize: 24, color: 'white'}} weight={500}>
              Dashboard
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
                /
              </Text>
            </Group>
          </UnstyledButton>
        </Group>
      </div>

      <Divider orientation="vertical" style={{marginLeft: 20, marginRight: 20}} />

      <div style={{flexGrow: 1}}>
        Hello
      </div>
		</div>
	);
}

export default Dashboard;