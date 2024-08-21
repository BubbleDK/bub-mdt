import { ScrollArea, Text } from '@mantine/core'
import React from 'react'
import '../../index.css';
import Card from '../Card';
import useAnnouncementStore from '../../../../../../stores/announcementStore';
import locales from '../../../../../../locales';


const ViewAllAnnouncements = () => {
  const { announcements } = useAnnouncementStore(state => ({
    announcements: state.announcements,
  }));
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    return Number(new Date(b.createdAt)) - Number(new Date(a.createdAt));
  });

  return (
    <ScrollArea h={600}>
      <div className='announcement-card-content'>
        {sortedAnnouncements.length > 0 ? (
          sortedAnnouncements.map((announcement) => (
            <Card announcement={announcement} key={announcement.id} />
          ))
        ) : (
          <Text color='dimmed' size='xs'>
            {locales.no_announcements_found}
          </Text>
        )}
      </div>
    </ScrollArea>
  )
}

export default ViewAllAnnouncements;