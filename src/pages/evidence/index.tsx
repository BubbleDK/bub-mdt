import { LoadingOverlay, createStyles } from '@mantine/core';
import React, { useState } from 'react'
import customLoader from '../../components/customLoader';
import SearchEvidenceTable from './components/SearchEvidenceTable';

const useStyles = createStyles((theme) => ({
  evidence: {
    height: 880,
    margin: 20,
    display: 'flex',
    gap: 15
  },
}));

const Evidence = () => {
  const { classes } = useStyles();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={classes.evidence}>
      <SearchEvidenceTable />
      <LoadingOverlay visible={isLoading} overlayOpacity={0.95} overlayColor={"rgb(34, 35, 37)"} transitionDuration={250} loader={customLoader} style={{left: 760, width: 1040, height: '96%', top: 19, borderRadius: '0.25rem'}} />
    </div>
  )
}

export default Evidence;