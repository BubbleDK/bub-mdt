import { Badge, Table, Group, Text, ActionIcon, ScrollArea, Tooltip } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import './RecentActivity.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useProfilesStore } from '../../../../../stores';
import useIncidentStore from '../../../../../stores/incidents/incident';
import useRecentActivityStore from '../../../../../stores/recentActivityStore';
import { fetchNui } from '../../../../../utils/fetchNui';
import { Incident, Profile } from '../../../../../typings';
import { DEBUG_PROFILE } from '../../../../../stores/profilesStore';
import locales from '../../../../../locales';

dayjs.extend(relativeTime)

const RecentActivity = () => {
  const setSelectedPlayer = useProfilesStore((state) => state.setSelectedProfile);
  const { setActiveIncident, setIncidentActive } = useIncidentStore();
  const { getRecentActivity, recentActivity } = useRecentActivityStore();
  const navigate = useNavigate();

  const getTimeAgoText = (timeAgo: string) => {
    const word = dayjs(timeAgo).fromNow();
    return capitalizeFirstLetter(word);
  }

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    getRecentActivity();
  }, []); 

  const rows = recentActivity.map((item, index) => (
    <tr key={index}>
      <td>
        <Badge color={item.type === 'created' ? "green" : (item.type === 'updated' ? 'yellow' : 'red')} radius="sm">{capitalizeFirstLetter(item.type)}</Badge>
      </td>

      <td>
        <Text>{capitalizeFirstLetter(item.category)}</Text>
      </td>
      <td>
        <Text>{item.firstname} {item.lastname}</Text>
      </td>
      <td>
        <Text>{getTimeAgoText(item.date)}</Text>
      </td>

      <td>
        {item.type !== 'deleted' && (
          <Group spacing={0} position="right">
            <Tooltip label="View" color='gray' position="bottom" withArrow>
              <ActionIcon 
                onClick={async () => {
                  if (item.category === 'profiles') {
                    const resp = await fetchNui<Profile>('getProfile', item.citizenid, {
                      data: {
                        ...DEBUG_PROFILE
                      },
                    });
                    setSelectedPlayer(resp);
                  } else if (item.category === 'incidents') {
                    const resp = await fetchNui<Incident>('getIncident', item.activityid, {
                      data: {
                        id: 1,
                        officersInvolved: [],
                        evidence: [],
                        title: 'Funny title',
                        description: '<p></p>',
                        criminals: [],
                      },
                    });
                    setActiveIncident(resp);
                    setIncidentActive(true);
                  }

                  navigate(`/${item.category}`);
                }}
              >
                <IconEye size="1.1rem" stroke={1.5} color='white' />
              </ActionIcon>
            </Tooltip>
          </Group>
        )}
      </td>
    </tr>
  ));

  return (
    <div className='recent-activity-content'>
      <Text style={{ fontSize: 18, color: 'white' }} weight={500}>
        {locales.recent_activity}
      </Text>
      <ScrollArea className='recent-activity'>
        <Table verticalSpacing="sm">
          <thead className='table-header'>
            <tr>
              <th>{locales.type}</th>
              <th>{locales.category}</th>
              <th>{locales.done_by}</th>
              <th>{locales.time_ago}</th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  )
}

export default RecentActivity