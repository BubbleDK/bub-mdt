import React, { useEffect, useState } from 'react'
import { Alert, LoadingOverlay, Transition, createStyles } from "@mantine/core";
import { IncidentData } from '../../typings';
import { useStoreIncidents } from '../../store/incidentsStore';
import SearchTableIncidents from './components/SearchTableIncidents';
import IncidentRow from './components/IncidentRow';
import CriminalsRow from './components/CriminalsRow';
import customLoader from '../../components/customLoader';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertCircle } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  incidents: {
    height: 880,
    margin: 20,
    display: 'flex',
    gap: 15
  },
}));

const Incidents = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setIncident, selectedIncident, resetNewIncident } = useStoreIncidents();
  const { classes, cx } = useStyles();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [alertText, setAlertText] = useState('');

  const setIncidentClick = (props: IncidentData | null) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIncident(props);

      if (props === null) {
        resetNewIncident();
      }
    }, 650)
  }

  const saveIncidentClick = () => {
    setAlertText('You sucessfully saved the incident report');
    toggle();

    setTimeout(() => {
      close();
    }, 2000)
  }

  const createIncidentClick = () => {
    setAlertText('You sucessfully created a new incident report');
    toggle();

    setTimeout(() => {
      close();
    }, 2000)
  }

  useEffect(() => {
    if (!selectedIncident) return;
    let mountedSelectedProfile = selectedIncident;
    setIncident(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIncident(mountedSelectedProfile);
    }, 650)
  }, []);

  return (
    <div className={classes.incidents}>
      <SearchTableIncidents onClick={setIncidentClick}  />
      <LoadingOverlay visible={isLoading} overlayOpacity={0.95} overlayColor={"rgb(34, 35, 37)"} transitionDuration={250} loader={customLoader} style={{left: 785, width: '55.8%', height: '96%', top: 19, borderRadius: '0.25rem'}} />

      <IncidentRow handleUnlink={setIncidentClick} handleCreateNewIncident={createIncidentClick} handleSaveIncident={saveIncidentClick} />
      <CriminalsRow />
      
      <Transition mounted={opened} transition={'scale'} duration={200} timingFunction="ease">
        {(styles) => (
          <Alert style={{...styles, position: 'fixed', bottom: 15, left: '50%', transform: 'translateX(-50%)', width: 400}} icon={<IconAlertCircle size="1rem" />} color="green" radius="xs" variant="filled">
            {alertText}
          </Alert>
        )}
      </Transition>
    </div>
  )
}

export default Incidents;