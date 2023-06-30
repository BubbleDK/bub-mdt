import { createStyles, DEFAULT_THEME, LoadingOverlay } from '@mantine/core';
import React, { useState } from 'react'
import { ReportData } from '../../typings/reports';
import SearchReports from './components/SearchReports';
import customLoader from '../../components/customLoader';

const useStyles = createStyles((theme) => ({
  reports: {
    height: 880,
    margin: 20,
    display: 'flex',
    gap: 15
  },
}));

const Reports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { classes } = useStyles();

  const setReportClick = (props: ReportData | null) => {
    setIsLoading(true);
  
    setTimeout(() => {
      setIsLoading(false);
    }, 650)
  }
  return (
    <div className={classes.reports}>
      <SearchReports onClick={setReportClick}  />
      <LoadingOverlay visible={isLoading} overlayOpacity={0.95} overlayColor={"rgb(34, 35, 37)"} transitionDuration={250} loader={customLoader} style={{left: 785, width: '55.8%', height: '96%', top: 19, borderRadius: '0.25rem'}} />

      
    </div>
  )
}

export default Reports