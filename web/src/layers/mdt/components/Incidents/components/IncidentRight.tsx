import { Button, rem, ScrollArea, Text } from '@mantine/core';
import { IconFileOff, IconUserPlus } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import AddCriminalModal from './modals/AddCriminalModal';
import CriminalCard from './CriminalCard';
import useIncidentStore from '../../../../../stores/incidents/incident';
import locales from '../../../../../locales';

const IncidentRight = () => {
  const { incident, isIncidentActive } = useIncidentStore();

  if (!isIncidentActive) return (
    <div className='content-width'>
      <div className='card-background'>
        <div className="profile-no-selected">
          <IconFileOff size={rem(50)} color='white' />
          <Text style={{ fontSize: 15, color: 'white' }} weight={600}>
            {locales.no_incident_selected}
          </Text>
        </div>
      </div>
    </div>
  );

  return (
    <ScrollArea h={860}>
      <div className='incident-criminals-content-width'>
        <Button fullWidth variant="light" color="gray" onClick={() => modals.open({ title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.add_criminal}</Text>, centered: true, size: 'sm', children: <AddCriminalModal /> })}>
          <IconUserPlus size={rem(18)} style={{ marginRight: 5 }} /> {locales.add_criminal}
        </Button>

        {incident.criminals.map(criminal => (
          <CriminalCard criminal={criminal} key={criminal.citizenid} />
        ))}
      </div>
    </ScrollArea>
  )
}

export default IncidentRight;