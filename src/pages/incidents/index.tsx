import React, { useEffect, useState } from 'react'
import { LoadingOverlay, createStyles } from "@mantine/core";
import { IncidentData } from '../../typings';
import { useStoreIncidents } from '../../store/incidentsStore';
import SearchTableIncidents from './components/SearchTableIncidents';
import IncidentRow from './components/IncidentRow';
import CriminalsRow from './components/CriminalsRow';
import customLoader from '../../components/customLoader';

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
  const { setIncident, selectedIncident } = useStoreIncidents();
  const { classes, cx } = useStyles();

  const handleClick = (props: IncidentData | null) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIncident(props);
    }, 650)
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
      <SearchTableIncidents onClick={handleClick}  />
      <LoadingOverlay visible={isLoading} overlayOpacity={0.95} overlayColor={"rgb(34, 35, 37)"} transitionDuration={250} loader={customLoader} style={{left: 785, width: '55.8%', height: '96%', top: 19, borderRadius: '0.25rem'}} />

      <IncidentRow handleUnlink={handleClick} />
      <CriminalsRow />
    </div>
  )
}

export default Incidents;