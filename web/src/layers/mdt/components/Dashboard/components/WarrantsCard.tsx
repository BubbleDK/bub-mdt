import React, { useEffect, useState } from 'react'
import '../index.css';
import { rem, Divider, Text, Center, Loader, Group, Avatar, Stack, ScrollArea } from '@mantine/core'
import { IconUserExclamation } from '@tabler/icons-react'
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import useIncidentStore from '../../../../../stores/incidents/incident';
import useWarrantStore from '../../../../../stores/warrantStore';
import { isEnvBrowser } from '../../../../../utils/misc';
import { fetchNui } from '../../../../../utils/fetchNui';
import { Incident } from '../../../../../typings';
import locales from '../../../../../locales';

const WarrantsCard = () => {
  const { warrants, getWarrants } = useWarrantStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setActiveIncident, setIncidentActive } = useIncidentStore();

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      getWarrants();
    };

    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className='card-background'>
      <div className='card-title'>
        <Text style={{fontSize: 17, color: 'white'}} weight={500}>
          {locales.active_warrants}
        </Text>

        <IconUserExclamation size={rem(25)} color='white' />
      </div>

      <Divider mt={5} mb={5} />

      <ScrollArea h={290}>
        <div className='warrants-card-content'>
          {isLoading ? (
            <Center h={'100%'}>
              <Loader />
            </Center>
          ) : warrants.length > 0 ? (
              warrants.map((warrant) => (
                <Group 
                  position="apart" 
                  className='warrants-card'       
                  onClick={async () => {
                    if (isEnvBrowser()) return;
                    const resp = await fetchNui<Incident>('getIncident', warrant.incidentid);
                    setActiveIncident(resp);
                    setIncidentActive(true);
                    navigate('/incidents');
                  }}
                >
                  <Group>
                    <Avatar color="blue" src={warrant.image} />
                    <Stack spacing={0}>
                      <Text fw={500} c={'white'}>{`${warrant.firstname} ${warrant.lastname}`}</Text>
                      <Text size="xs" c="dark.2">
                        {locales.expires_in}: {dayjs().to(warrant.expiresAt, true)}
                      </Text>
                    </Stack>
                  </Group>
                </Group>
              ))
          ) : (
            <Text color='dimmed' size='xs'>
              {locales.no_warrants_found}
            </Text>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export default WarrantsCard