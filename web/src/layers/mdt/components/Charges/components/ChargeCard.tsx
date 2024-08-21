import { Badge, Tooltip, Group, Button, Text, ActionIcon } from '@mantine/core'
import React from 'react'
import '../index.css'
import { Charge } from '../../../../../typings'
import { modals } from '@mantine/modals'
import EditChargeModal from './modals/EditChargeModal'
import { fetchNui } from '../../../../../utils/fetchNui'
import { IconTrash } from '@tabler/icons-react'
import { useChargeStore, usePersonalDataStore } from '../../../../../stores'
import { ChargesObject } from '../../../../../stores/chargesStore'
import locales from '../../../../../locales'

interface Props {
  charge: Charge
}

const ChargeCard = ({ charge }: Props) => {
  const { setCharges } = useChargeStore();
  const personalRole = usePersonalDataStore(state => state.personalData.role);

  function checkPermissionForRole(personalRole: string): boolean {
    if (personalRole === 'Chief' || personalRole === 'Assistant Chief' || personalRole === 'Captain' || personalRole === 'Lieutenant' || personalRole === 'Sergeant') {
      return false;
    } else {
      return true;
    }
  }

  return (
    <div className='charges-charge-card'>
      <Text fz="sm" fw={500} c="white" style={{textAlign: 'center'}}>
        {charge.label}
      </Text>

      <div style={{display: 'flex', gap: 5, justifyContent: 'center'}}>
        <Badge 
          radius="xs" 
          variant="filled"
          style={{backgroundColor: 'rgb(42, 42, 42)', color: 'white', fontSize: 10, padding: 12.5, fontWeight: 500}}
        >
          ${charge.fine} {locales.fine}
        </Badge>

        <Badge 
          radius="xs" 
          variant="filled"
          style={{backgroundColor: 'rgb(42, 42, 42)', color: 'white', fontSize: 10, padding: 12.5, fontWeight: 500}}
        >
          {charge.time} {locales.months}
        </Badge>

        <Badge 
          radius="xs" 
          variant="filled"
          style={{backgroundColor: 'rgb(42, 42, 42)', color: 'white', fontSize: 10, padding: 12.5, fontWeight: 500}}
        >
          {charge.points} {locales.points}
        </Badge>
      </div>

      <Tooltip label={charge.description} multiline withArrow color='gray'>
        <Text fz='xs' fw={500} mt={2} style={{textAlign: 'center', color: 'white'}} lineClamp={2}>
          {charge.description}
        </Text>
      </Tooltip>

      <Group position="apart" style={{ flex: '1' }}>
        <Badge 
          radius="xs" 
          variant="filled"
          style={{fontSize: 10, padding: 12.5, fontWeight: 500}}
          color={charge.type.toLocaleLowerCase() === 'felony' ? 'red' : (charge.type.toLocaleLowerCase() === 'infraction' ? 'green' : 'yellow')}
        >
          {charge.type.charAt(0).toUpperCase() + charge.type.slice(1)}
        </Badge>
        
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <ActionIcon variant="light" disabled={checkPermissionForRole(personalRole)} onClick={() => { 
            modals.openConfirmModal({
              title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.delete_charge}</Text>,
              size: 'sm',
              centered: true,
              labels: { confirm: locales.confirm, cancel: locales.cancel },
              groupProps: {
                spacing: 6,
              },
              confirmProps: { color: 'red' },
              onConfirm: async () => {
                const success = await fetchNui(
                  'deleteCharge',
                  { label: charge.label },
                  { data: 1 }
                );

                if (success) {
                  setCharges((prevCharges) => {
                    const newCharges: ChargesObject = {};
                    Object.keys(prevCharges).forEach((category) => {
                      newCharges[category] = prevCharges[category].filter(c => c.label !== charge.label);
                    });
                    return newCharges;
                  });
                }
              },
              children: (
                <Text size="sm" c="dark.2">
                  {locales.delete_charge_confirm.format(charge.label)}
                </Text>
              ),
            })
          }}>
            <IconTrash size={16} color={!checkPermissionForRole(personalRole) ? 'white' : 'gray'} />
          </ActionIcon>

          <Button 
            disabled={checkPermissionForRole(personalRole)}
            color="gray" 
            compact                 
            onClick={() =>
              modals.open({ 
                title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.edit_charge}</Text>, 
                centered: true, 
                size: 'sm', 
                children: <EditChargeModal charge={charge} /> 
              })
            }
          >
            {locales.edit}
          </Button>
        </div>
      </Group>
    </div>
  )
}

export default ChargeCard