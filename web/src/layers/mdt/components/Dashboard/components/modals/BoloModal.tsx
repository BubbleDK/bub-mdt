import { Button, Divider, Text } from '@mantine/core'
import React from 'react'
import locales from '../../../../../../locales';
import { Bolo } from '../../../../../../stores/bolosStore';
import { useNavigate } from 'react-router-dom';
import useVehiclesStore, { DEBUG_VEHICLE1, DEBUG_VEHICLE2 } from '../../../../../../stores/vehicles/vehicles';
import { fetchNui } from '../../../../../../utils/fetchNui';
import { Vehicle } from '../../../../../../typings';
import { modals } from '@mantine/modals';

interface props {
  bolo: Bolo
}

const BoloModal = (props: props) => {
  const { setSelectedVehicle, setIsVehicleBOLO, setBOLOExpirationDate } = useVehiclesStore();
  const DEBUG_VEH = (Math.random() * 10) > 5 ? DEBUG_VEHICLE1 : DEBUG_VEHICLE2
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Divider />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Text style={{ fontSize: 18, color: 'white' }} weight={500}>
          {locales.reason}
        </Text>

        <Text c="gray.4" size='sm'>
          {props.bolo.reason}
        </Text>

        <Text c="dimmed" size='xs' mt={5}>
          {locales.expires_at} {props.bolo.expiresAt}
        </Text>
      </div>

      <Divider />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', width: '100%', justifyContent: 'center' }}>
        <Button
          variant="light"
          color='gray'
          w={200}
          onClick={async () => {
            setSelectedVehicle(null);
            const resp = await fetchNui<Vehicle>('getVehicle', { plate: props.bolo.plate }, {
              data: {
                ...DEBUG_VEH,
              },
            });
        
            const isVehicleBolo = await fetchNui<boolean>('isVehicleBOLO', { plate: props.bolo.plate }, {
              data: false,
            });
        
            if (isVehicleBolo) {
              const BOLODate = await fetchNui<string>('getBOLOExpirationDate', { plate: props.bolo.plate }, {
                data: '12/12/2024',
              });
        
              setBOLOExpirationDate(BOLODate);
            }
        
            setSelectedVehicle(resp);
            setIsVehicleBOLO(isVehicleBolo);

            navigate('/vehicles');
            modals.closeAll();
          }}
        >
          {locales.goto_vehicle}
        </Button>
      </div>
    </div>
  )
}

export default BoloModal;