import React, { useEffect } from "react";
import { Box, Divider, Paper, Text, Title, Group, Button, ActionIcon } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { IconEye } from "@tabler/icons-react";
import { Activity, useRecentActivityStore } from "../../../store/recentActivity";
import { timeAgo } from "../../../utils/convertDateToTime";
import { useNavigate } from 'react-router-dom';
import { useStoreProfiles } from "../../../store/profilesStore";

const RecentActivity = () => {
  const { recentActivity } = useRecentActivityStore();
  const { findProfileByCitizenId } = useStoreProfiles();
  const navigate = useNavigate();
  const viewFunction = (activity: Activity) => {
    findProfileByCitizenId(activity.activityID);
    navigate(`${activity.category.toLocaleLowerCase()}`);
  }

	return (
		<Paper p='md' withBorder style={{ width: "40%" }}>
			<Divider
				my='xs'
				labelPosition='center'
				label={
					<>
						<Box ml={5}>
							<Title order={5} weight={500}>
								Recent Activity
							</Title>
						</Box>
					</>
				}
			/>
			<Box sx={{ height: 530 }}>
				<DataTable
					horizontalSpacing='md'
					verticalSpacing='md'
					highlightOnHover
					columns={[
            { accessor: "type" },
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
            const timeDiff = timeAgo(activity.timeAgo);
            return { ...activity, timeAgotext: timeDiff };
          })}
				/>
			</Box>
		</Paper>
	);
};

export default RecentActivity;
