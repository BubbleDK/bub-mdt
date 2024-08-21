import React, { useState } from 'react'
import CustomLoader from '../CustomLoader';
import { LoadingOverlay } from '@mantine/core';
import { fetchNui } from '../../../../utils/fetchNui';
import { PartialReportData, Report } from '../../../../typings/report';
import useReportStore from '../../../../stores/reports/report';
import ReportList from './components/ReportList';
import ReportMiddle from './components/ReportMiddle';
import ReportRight from './components/ReportRight';

const Reports = () => {
  const { setActiveReport, setReportActive } = useReportStore();
  const [loading, setLoading] = useState(false);

  const handleReportClick = async (report: PartialReportData) => {
    setLoading(true);
    const resp = await fetchNui<Report>('getReport', report.id, {
      data: {
        id: 1,
        title: report.title,
        description: '<p></p>',
        officersInvolved: [],
        citizensInvolved: [],
        evidence: []
      },
    });
    setActiveReport(resp);
    setReportActive(true);
    setLoading(false);
  }

  return (
    <div className='reports'>
      <ReportList handleReportClick={handleReportClick} />

      <LoadingOverlay visible={loading} overlayOpacity={0.97} overlayColor={"rgb(34, 35, 37)"} transitionDuration={250} loader={CustomLoader} style={{left: 795, width: 935, height: '96%', top: 19, borderRadius: '0.25rem'}} />
      <ReportMiddle />
      <ReportRight />
    </div>
  )
}

export default Reports;