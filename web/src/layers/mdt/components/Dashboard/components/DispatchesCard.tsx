import React, { useEffect, useMemo, useState } from 'react'
import '../index.css';
import { rem, Divider, Text, Center, Loader, Group, ScrollArea } from '@mantine/core'
import { IconClock, IconPhoneIncoming } from '@tabler/icons-react'
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useCallsStore } from '../../../../../stores/dispatch/calls';
import locales from '../../../../../locales';

const DispatchesCard = () => {
  const { calls, fetchCalls } = useCallsStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      fetchCalls();
    };

    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  const sortedCalls = useMemo(() => {
    return calls.sort((a, b) => b.id - a.id);
  }, [calls]);

  return (
    <div className='card-background'>
      <div className='card-title'>
        <Text style={{fontSize: 17, color: 'white'}} weight={500}>
          {locales.dispatch}
        </Text>

        <IconPhoneIncoming size={rem(25)} color='white' />
      </div>

      <Divider mt={5} mb={5} />

      <ScrollArea h={330}>
        <div className='warrants-card-content'>
          {isLoading ? (
            <Center h={'100%'}>
              <Loader />
            </Center>
          ) : sortedCalls.length > 0 ? (
            sortedCalls.map((call) => (
              <div className='active-dispatchcall-card' onClick={() => {
                navigate('/dispatch')
              }}>
                <Group style={{ width: '100%' }}>
                  <div style={{ flex: 1 }}>
                    <Text style={{fontSize: 13, color: 'white'}} weight={500}>
                      ({call.code}) {call.offense}
                    </Text>

                    <div style={{
                      display: 'flex',
                      gap: 5
                    }}>
                      <IconClock size={16} color='#C1C2C5' />
                      <Text color='dimmed' size='xs'>
                        {dayjs(call.time).fromNow()}
                      </Text>
                    </div>
                  </div>

                  <Text color='dimmed' size='xs'>
                    {locales.responding_units}: {call.units.length}
                  </Text>
                </Group>
              </div>
            ))
          ) : (
            <Text color='dimmed' size='xs'>
              {locales.no_recent_calls_found}
            </Text>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export default DispatchesCard