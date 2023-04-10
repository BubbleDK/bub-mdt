import React from "react";
import { Box, Divider, Paper, Text, Title, Group, Button } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { IconEye } from "@tabler/icons-react";

const RecentActivity = () => {
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
						{ accessor: "category" },
						{ accessor: "action" },
						{ accessor: "doneBy" },
						{ accessor: "timeAgo" },
						{
							accessor: "actions",
							title: <Text mr='xs'>Action</Text>,
							textAlignment: "center",
							render: () => (
								<Group position='center' noWrap>
									<Button
										leftIcon={<IconEye size='1rem' />}
										compact
										variant="light"
									>
										View
									</Button>
								</Group>
							),
						},
					]}
					records={[
						{
							id: 1,
							category: "Incident",
							action: "Created",
							doneBy: "Bubble",
							timeAgo: "1 minute ago",
						},
						{
							id: 2,
							category: "Incident",
							action: "Created",
							doneBy: "Bubble",
							timeAgo: "1 minute ago",
						},
						{
							id: 3,
							category: "Incident",
							action: "Created",
							doneBy: "Bubble",
							timeAgo: "1 minute ago",
						},
						{
							id: 4,
							category: "Incident",
							action: "Created",
							doneBy: "Bubble",
							timeAgo: "1 minute ago",
						},
						{
							id: 5,
							category: "Incident",
							action: "Created",
							doneBy: "Bubble",
							timeAgo: "1 minute ago",
						},
						{
							id: 6,
							category: "Incident",
							action: "Created",
							doneBy: "Bubble",
							timeAgo: "1 minute ago",
						},
						{
							id: 7,
							category: "Incident",
							action: "Created",
							doneBy: "Bubble",
							timeAgo: "1 minute ago",
						},
						{
							id: 8,
							category: "Incident",
							action: "Created",
							doneBy: "Bubble",
							timeAgo: "1 minute ago",
						},
					]}
				/>
			</Box>
		</Paper>
	);
};

export default RecentActivity;
