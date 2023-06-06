import React, { useEffect } from "react";
import { Box, Divider, Paper, Text, Title, Group, Button, ActionIcon, createStyles, Badge } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { IconEye } from "@tabler/icons-react";
import { Activity, useRecentActivityStore } from "../../../store/recentActivity";
import { useNavigate } from 'react-router-dom';
import { useStoreProfiles } from "../../../store/profilesStore";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime)

const useStyles = createStyles((theme) => ({
  header: {
    '&& th': { fontWeight: 500 },
  },
}));

const RecentActivity = () => {
  const { recentActivity } = useRecentActivityStore();
  const { findProfileByCitizenId } = useStoreProfiles();
  const navigate = useNavigate();
  const viewFunction = (activity: Activity) => {
    findProfileByCitizenId(activity.activityID);
    navigate(`${activity.category.toLocaleLowerCase()}`);
  }
  const { classes } = useStyles();

	return (
    <div>
      <Text style={{fontSize: 17, color: 'white', marginLeft: 5}} weight={500}>
        Recent Activity
      </Text>
      <Box style={{backgroundColor: '#222325', height: 409, borderRadius: '5px'}}>
        <DataTable
          withBorder
          borderRadius={5}
          rowStyle={{ backgroundColor: '#222325' }}
          classNames={classes}
          horizontalSpacing='md'
          verticalSpacing='md'
          highlightOnHover
          columns={[
            { 
              accessor: "type",
              render: (activity) => (
                <Badge color={activity.type === 'Created' ? "teal" : (activity.type === 'Updated' ? 'yellow' : 'red')} radius="sm">{activity.type}</Badge>
              ),
            },
            { accessor: "category" },
            { accessor: "doneBy" },
            { 
              accessor: "timeAgo",
              render: (activity) => (
                <Text>{activity.timeAgotext}</Text>
              ),
            },
            {
              accessor: "actions",
              title: <Text mr='xs'>Action</Text>,
              textAlignment: "center",
              render: (activity) => (
                <Group position='center' noWrap>
                  <Button
                    leftIcon={<IconEye size='1rem' />}
                    compact
                    style={{backgroundColor: 'rgba(51, 124, 255, 0.2)', color: 'rgba(159, 194, 255, 0.8)'}}
                    variant="light"
                    onClick={() => {viewFunction(activity)}}
                  >
                    View
                  </Button>
                </Group>
              ),
            },
          ]}
          records={recentActivity.slice().reverse().map((activity: Activity) => {
            const word = dayjs(activity.timeAgo).fromNow();
            const capitalized = word.charAt(0).toUpperCase() + word.slice(1)
            return { ...activity, timeAgotext: capitalized };
          })}
          idAccessor="activity.activityID"
        />
      </Box>
    </div>
	);
};

export default RecentActivity;
