import React from 'react';
import { Box, createStyles, Divider, Flex, Paper, Text, Title, Group, ActionIcon, Button } from '@mantine/core';
import DashboardStats from './components/DashboardStats';
import { DataTable } from 'mantine-datatable';
import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";

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
        <Paper radius="md" p="md" withBorder style={{width: '42.5%', height: 620}}>
          {/* <Group position="center" noWrap>
            <Title order={3} weight={500} style={{marginBottom: 20}}>Recent Activity</Title>
          </Group>
          <Divider my="sx" /> */}
          <Divider
            my="xs"
            labelPosition="center"
            label={
              <>
                <Box ml={5}><Title order={5} weight={500}>Recent Activity</Title></Box>
              </>
            }
          />
          <Box sx={{ height: 530 }}>
            <DataTable
              horizontalSpacing="md"
              verticalSpacing="md"
              highlightOnHover
              columns={[
                { accessor: 'category' },
                { accessor: 'action' },
                { accessor: 'doneBy' },
                { accessor: 'timeAgo' },
                {
                  accessor: 'actions',
                  title: <Text mr="xs">Action</Text>,
                  textAlignment: 'center',
                  render: () => (
                    <Group position="center" noWrap>
                      <Button leftIcon={<IconEye size="1rem" />} compact variant="default">
                        View
                      </Button>
                    </Group>
                  ),
                },
              ]}
              records={[{id: 1, category: 'Incident', action: 'Created', doneBy: 'Bubble', timeAgo: '1 minute ago'}, {id: 2, category: 'Incident', action: 'Created', doneBy: 'Bubble', timeAgo: '1 minute ago'}, {id: 3, category: 'Incident', action: 'Created', doneBy: 'Bubble', timeAgo: '1 minute ago'}, {id: 4, category: 'Incident', action: 'Created', doneBy: 'Bubble', timeAgo: '1 minute ago'}, {id: 5, category: 'Incident', action: 'Created', doneBy: 'Bubble', timeAgo: '1 minute ago'}, {id: 6, category: 'Incident', action: 'Created', doneBy: 'Bubble', timeAgo: '1 minute ago'}, {id: 7, category: 'Incident', action: 'Created', doneBy: 'Bubble', timeAgo: '1 minute ago'}, {id: 8, category: 'Incident', action: 'Created', doneBy: 'Bubble', timeAgo: '1 minute ago'}]}
            />
          </Box>
        </Paper>
      </Flex>
		</Box>
	);
}

export default Dashboard;