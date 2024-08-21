import React, { useEffect, useState } from 'react'
import '../index.css';
import { rem, Divider, Text, Center, Loader, ScrollArea } from '@mantine/core'
import { IconBadgeTm, IconZoomExclamation } from '@tabler/icons-react'
import locales from '../../../../../locales';
import useBoloStore, { Bolo } from '../../../../../stores/bolosStore';
import { modals } from '@mantine/modals';
import BoloModal from './modals/BoloModal';
import { fetchNui } from '../../../../../utils/fetchNui';
import dayjs from 'dayjs';

const BolosCard = () => {
  const { bolos, getBolos } = useBoloStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      getBolos();
    };

    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className='card-background'>
      <div className='card-title'>
        <Text style={{fontSize: 17, color: 'white'}} weight={500}>
          {locales.bolos}
        </Text>

        <IconZoomExclamation size={rem(25)} color='white' />
      </div>

      <Divider mt={5} mb={5} />

      <ScrollArea h={290}>
        <div className='warrants-card-content'>
          {isLoading ? (
            <Center h={'100%'}>
              <Loader />
            </Center>
          ) : bolos.length > 0 ? (
            bolos.map((bolo) => (
              <div className='bolos-card' onClick={async () => {
                const selectedBOlO = await fetchNui<Bolo>('getBolo', { plate: bolo.plate }, {
                  data: {
                    plate: 'ABCDEFG',
                    reason: 'A pretty nice and cool reason',
                    expiresAt: dayjs(new Date()).format('DD-MM-YYYY')
                  },
                });
                modals.open({
                  title: <div style={{ display: 'flex', gap: 10, alignItems: 'center'}}>
                    <IconBadgeTm size={20} color='#C1C2C5' /> 
                    <Text style={{ fontSize: 16, color: "white" }} weight={500}>{selectedBOlO.plate}</Text>
                  </div>,
                  centered: true,
                  children: <BoloModal bolo={selectedBOlO} />,
                });
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                      <IconBadgeTm size={20} color='#C1C2C5' />

                      <Text style={{fontSize: 13, color: 'white'}} weight={500}>
                        {bolo.plate}
                      </Text>
                    </div>
                    
                    <Text color='dimmed' size='xs'>
                      {locales.expires_at} {bolo.expiresAt}
                    </Text>
                  </div>

                  <Text c="gray.4" size='xs' lineClamp={2}>
                    {bolo.reason}
                  </Text>
                </div>
              </div>
            ))
          ) : (
            <Text color='dimmed' size='xs'>
              {locales.no_bolos_found}
            </Text>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export default BolosCard