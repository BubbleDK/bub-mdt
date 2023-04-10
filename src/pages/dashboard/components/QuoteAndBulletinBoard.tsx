import React from 'react'
import { Box, Divider, Paper, Title, Group, Text, ScrollArea, Badge } from '@mantine/core';
import { useStoreAnnouncements } from '../../../store/announcementsStore';
import { timeAgo } from '../../../utils/convertDateToTime';

const QuoteAndBulletinBoard = () => {
  const { announcements } = useStoreAnnouncements();

  return (
    <>
      <Paper p='md' withBorder style={{width: '29%'}}>
        <Divider my='xs' labelPosition='center' label={
          <Title order={5} weight={500}>
            Bulletin Board
          </Title>}
        />
        <Box>
          <ScrollArea h={530}>
            {announcements.map((announcement) => (
              <Paper p='md' radius="xs" withBorder sx={(theme) => ({backgroundColor: theme.colors.dark[6], marginBottom: 5})}>
              <Group position="apart">
                <Text fz={14} fw={500}>
                  {announcement.title}
                </Text>
                <Badge size="sm">{timeAgo(announcement.time)}</Badge>
              </Group>
              <Text fz={12} style={{marginTop: 10, marginBottom: 10}}>{announcement.content}</Text>
              <Text fz={12}>Posted by: <Text span inherit fz={12} fw={500}>{announcement.postedBy.firstname} {announcement.postedBy.lastname}</Text></Text>
            </Paper>
            ))}
          </ScrollArea>
        </Box>
      </Paper>
    </>
  )
}

export default QuoteAndBulletinBoard