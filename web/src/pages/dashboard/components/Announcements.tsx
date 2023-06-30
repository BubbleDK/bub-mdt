import React from 'react'
import { Badge, Group, Paper, Text } from '@mantine/core';
import { useStoreAnnouncements } from '../../../store/announcementsStore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime)

const Announcements = () => {
  const { announcements } = useStoreAnnouncements();

  return (
    <div style={{marginTop: 20}}>
      <Group position="apart" spacing="xs" style={{marginBottom: 5}}>
        <Text style={{fontSize: 17, color: 'white', marginLeft: 5}} weight={500}>
          Announcements
        </Text>
        <Text c="blue" style={{fontSize: 14, cursor: 'pointer'}} fw={600} onClick={() => {console.log("Click")}}>View All</Text>
      </Group>

      <div style={{display: 'flex', gap: 10 }}>
        {announcements.slice(0, 3).map((announcement) => (
          <Paper key={announcement.id} p='md' withBorder sx={(theme) => ({backgroundColor: 'rgb(34, 35, 37)', height: 290, borderRadius: 5})}>
            <Group position="apart">
              <Text fz={15} fw={550} c={'white'}>
                {announcement.title}
              </Text>
              <Badge size="sm" radius='sm' style={{backgroundColor: 'rgba(51, 124, 255, 0.2)', color: 'rgba(159, 194, 255, 0.8)'}}>{dayjs(announcement.time).fromNow()}</Badge>
            </Group>
            <Text fz={13} style={{marginTop: 10, marginBottom: 10, height: '75%'}}>{announcement.content}</Text>
            <Group position="apart" mt="md">
              <Text fz={12}>Posted by: <Text span inherit fz={12} fw={500}>{announcement.postedBy.firstname} {announcement.postedBy.lastname}</Text></Text>
            </Group>
          </Paper>
        ))}
      </div>
    </div>
  )
}

export default Announcements