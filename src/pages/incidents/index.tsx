import React, { useEffect, useState } from 'react'
import {Container, Flex, LoadingOverlay, Stack, DEFAULT_THEME, createStyles } from "@mantine/core";
import { IncidentData } from '../../typings';
import { useStoreIncidents } from '../../store/incidentsStore';
import SearchTableIncidents from './components/SearchTableIncidents';
import IncidentRow from './components/IncidentRow';
import CriminalsRow from './components/CriminalsRow';

const useStyles = createStyles((theme) => ({
  incidents: {
    height: 880,
    margin: 20,
    display: 'flex',
    gap: 15
  },
}));

const customLoader = (
  <svg
    width="54"
    height="54"
    viewBox="0 0 38 38"
    xmlns="http://www.w3.org/2000/svg"
    stroke={DEFAULT_THEME.colors.blue[6]}
  >
    <g fill="none" fillRule="evenodd">
      <g transform="translate(1 1)" strokeWidth="2">
        <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </g>
  </svg>
);

const Incidents = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setIncident } = useStoreIncidents();
  const { classes, cx } = useStyles();

  const handleClick = (props: IncidentData | null) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIncident(props);
    }, 650)
  }

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