import React from 'react';
import { Box, createStyles, Divider, Flex, Paper, Text, Title, Group, ActionIcon, Button } from '@mantine/core';
import DashboardStats from './components/DashboardStats';
import { DataTable } from 'mantine-datatable';
import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";
import RecentActivity from './components/RecentActivity';
import QuoteAndBulletinBoard from './components/QuoteAndBulletinBoard';
import ActiveOfficers from './components/ActiveOfficers';

const useStyles = createStyles((theme) => ({
  dashboard: {
    width: '100%',
    padding: `calc(${theme.spacing.xl} * 1.5)`,
  },
}));

const Dashboard = () => {
  const { classes } = useStyles();
  return (
		<Box className={classes.dashboard}>
      <Flex gap={25} direction="column" wrap="wrap">
        <DashboardStats />
        <Divider size="sm" />
        <Flex gap="xl" justify="center" direction="row" wrap="wrap">
          <RecentActivity />
          <QuoteAndBulletinBoard />
          <ActiveOfficers />
        </Flex>
      </Flex>
		</Box>
	);
}

export default Dashboard;