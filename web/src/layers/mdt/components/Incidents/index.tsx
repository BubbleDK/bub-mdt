import React, { useState } from 'react'
import CustomLoader from '../CustomLoader';
import { LoadingOverlay } from '@mantine/core';
import IncidentList from './components/IncidentList';
import IncidentMiddle from './components/IncidentMiddle';
import IncidentRight from './components/IncidentRight';
import useIncidentStore from '../../../../stores/incidents/incident';
import { Incident, PartialIncidentData } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';

const Incidents = () => {
  const { setActiveIncident, setIncidentActive } = useIncidentStore();
  const [loading, setLoading] = useState(false);

  const handleIncidentClick = async (incident: PartialIncidentData) => {
    setLoading(true);
    const resp = await fetchNui<Incident>('getIncident', incident.id, {
      data: {
        id: 1,
        officersInvolved: [],
        evidence: [],
        title: incident.title,
        description: '<p></p>',
        criminals: [],
      },
    });
    setActiveIncident(resp);
    setIncidentActive(true);
    setLoading(false);
  }

  return (
    <div className='incidents'>
      <IncidentList handleIncidentClick={handleIncidentClick} />

      <LoadingOverlay visible={loading} overlayOpacity={0.97} overlayColor={"rgb(34, 35, 37)"} transitionDuration={250} loader={CustomLoader} style={{left: 795, width: 935, height: '96%', top: 19, borderRadius: '0.25rem'}} />
      <IncidentMiddle />
      <IncidentRight />
    </div>
  )
}

export default Incidents;