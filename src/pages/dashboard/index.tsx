import React from 'react';
import { Box, createStyles, Divider, Flex } from '@mantine/core';
import DashboardStats from './components/DashboardStats';

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
      <Flex
        gap={25}
        direction="column"
        wrap="wrap"
      >
        <DashboardStats />
        <Divider size="sm" />
        <div>
          Hello
        </div>
      </Flex>
		</Box>
	);
}

export default Dashboard;