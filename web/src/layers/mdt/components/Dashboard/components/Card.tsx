import { Group, Avatar, Stack, Text } from '@mantine/core'
import dayjs from 'dayjs'
import React from 'react'
import '../index.css'
import relativeTime from 'dayjs/plugin/relativeTime';
import { modals } from '@mantine/modals'
import AnnouncementModal from './modals/AnnoucementModal'
import { Announcement } from '../../../../../typings';

dayjs.extend(relativeTime);

interface Props {
  announcement: Announcement
}

const Card = ({ announcement }: Props) => {
  const content = `<p>${announcement.contents}</p>`

  function removeHtmlTags(input: string): string {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
  }
  
  return (
    <div 
      className='announcement-list-card' 
      onClick={() => { 
        modals.open({
          title: <Text style={{ fontSize: 16, color: "white" }} weight={500}>{`${announcement.firstname} ${announcement.lastname}`} | {dayjs(announcement.createdAt).fromNow()}</Text>,
          centered: true,
          children: <AnnouncementModal contents={content} />,
        });
      }}
    >
      <Group position="apart">
        <Group>
          <Avatar color="blue" src={announcement.image} />
          <Stack spacing={0}>
            <Text fw={500} c={'white'}>{`${announcement.firstname} ${announcement.lastname}`}</Text>
            <Text size="xs" c="dark.2">
              {dayjs(announcement.createdAt).fromNow()}
            </Text>
          </Stack>
        </Group>
      </Group>

      <Text c="gray.4" size="sm" lineClamp={1}>
        {removeHtmlTags(content)}
      </Text>
    </div>
  )
}

export default Card