import React, { useEffect, useState } from 'react'
import '../index.css';
import { rem, Divider, Text, Center, Loader, ActionIcon, Tooltip } from '@mantine/core'
import { IconLayoutList, IconPlus, IconSpeakerphone } from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import CreateAnnouncementModal from './modals/CreateAnnouncementModal'
import Card from './Card'
import ViewAllAnnouncements from './modals/ViewAllAnnouncements'
import useAnnouncementStore from '../../../../../stores/announcementStore';
import { usePersonalDataStore } from '../../../../../stores';
import locales from '../../../../../locales';

const AnnouncementsCard = () => {
  const { announcements, fetchAnnouncements } = useAnnouncementStore(state => ({
    announcements: state.announcements,
    fetchAnnouncements: state.fetchAnnouncements
  }));
  const [isLoading, setIsLoading] = useState(false);
  const { role } = usePersonalDataStore((state) => state.personalData);

  function checkPermissionForRole(personalRole: string): boolean {
    if (personalRole === 'Chief' || personalRole === 'Assistant Chief' || personalRole === 'Captain' || personalRole === 'Lieutenant' || personalRole === 'Sergeant') {
      return false;
    } else {
      return true;
    }
  }

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    return Number(new Date(b.createdAt)) - Number(new Date(a.createdAt));
  }).slice(0, 3);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      return await fetchAnnouncements();
    };

    fetchData().then(() => {
      setIsLoading(false);
    });
  }, [])

  return (
    <div className='card-background'>
      <div className='card-title'>
        <Text style={{fontSize: 17, color: 'white'}} weight={500}>
          {locales.announcements}
        </Text>

        <div className='card-title-icons'>
          <Tooltip label={locales.create_announcement} withArrow color='gray' position='bottom'>
            <ActionIcon variant="light" color="dark" disabled={checkPermissionForRole(role)} onClick={() => { 
              modals.open({
                title: <Text style={{ fontSize: 16, color: "white" }} weight={500}>{locales.create_announcement}</Text>,
                centered: true,
                children: <CreateAnnouncementModal />,
              });
            }}>
              <IconPlus size={16} color={'white'} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={locales.view_all} withArrow color='gray' position='bottom'>
            <ActionIcon variant="light" color="dark" onClick={() => { 
              modals.open({
                title: <Text style={{ fontSize: 16, color: "white" }} weight={500}>{locales.all_announcements}</Text>,
                centered: true,
                children: <ViewAllAnnouncements />,
              });
            }}>
              <IconLayoutList size={16} color={'white'} />
            </ActionIcon>
          </Tooltip>
          <IconSpeakerphone size={rem(25)} color='white' />
        </div>
      </div>

      <Divider mt={5} mb={5} />

      <div className='announcement-card-content'>
        {isLoading ? (
          <Center h={'100%'}>
            <Loader />
          </Center>
        ) : sortedAnnouncements.length > 0 ? (
          sortedAnnouncements.map((announcement) => (
            <Card announcement={announcement} key={announcement.id} />
          ))
        ) : (
          <Text color='dimmed' size='xs'>
            {locales.no_announcements_found}
          </Text>
        )}
      </div>
    </div>
  )
}

export default AnnouncementsCard