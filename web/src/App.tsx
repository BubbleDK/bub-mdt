import { Transition, createStyles, Button } from '@mantine/core';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Profiles from './pages/profiles';
import Dispatch from './pages/dispatch';
import { useNuiEvent } from './hooks/useNuiEvent';
import { AlertData, IncidentData, OfficerData, ProfileData, ReportData, UnitData } from './typings';
import { useStoreOfficers } from './store/officersStore';
import { useStoreDispatch } from './store/dispatchStore';
import { useStoreUnit } from './store/unitStore';
import { useStorePersonal } from './store/personalInfoStore';
import { AnnouncementData, useStoreAnnouncements } from './store/announcementsStore';
import { useStoreProfiles } from './store/profilesStore';
import Incidents from './pages/incidents';
import { useStoreIncidents } from './store/incidentsStore';
import PenalCodes from './pages/penalcodes';
import Reports from './pages/reports';
import { useStoreReports } from './store/reportsStore';
import Roster from './pages/roster';
import Evidence from './pages/evidence';
import { Locale } from './store/locale';
import { isEnvBrowser } from './utils/misc';
import { useVisibility } from './store/visibilityStore';
import { Activity, useRecentActivityStore } from './store/recentActivity';
import { useExitListener } from './hooks/useExitListener';
import NavMenu from './components/NavMenu';

const useStyles = createStyles(() => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

function App() {
  const { classes } = useStyles();
  const [visible, setVisible] = useVisibility((state) => [state.visible, state.setVisible]);
  const { setReports } = useStoreReports();
  const { setOfficers, setActiveOfficers } = useStoreOfficers();
  const { setAlerts } = useStoreDispatch();
  const { setUnits } = useStoreUnit();
  const { setPersonalData } = useStorePersonal();
  const { setAnnouncements } = useStoreAnnouncements();
  const { setProfiles } = useStoreProfiles();
  const { setIncidents } = useStoreIncidents();
  const { setActivities } = useRecentActivityStore();

  useNuiEvent<{locale: { [key: string]: string }; personalInformation: OfficerData;}>('init', (data) => {
    for (const name in data.locale) Locale[name] = data.locale[name];
    setPersonalData(data.personalInformation);
  });

  useNuiEvent<{
    announcements: AnnouncementData[];
    recentActivity: Activity[];
  }>('setupMdt', (data) => {
    setAnnouncements(data.announcements);
    setActivities(data.recentActivity);

    setVisible(true);
  });

  useNuiEvent<{ activeOfficers: OfficerData[]; }>('updateActiveOfficers', (data) => {
    setActiveOfficers(data.activeOfficers);
  });

  useNuiEvent<{
    locale: { [key: string]: string };
    alerts?: AlertData[];
    officers: OfficerData[];
    units?: UnitData[];
    personalInformation: OfficerData;
    announcements: AnnouncementData[];
    profiles: ProfileData[];
    incidents: IncidentData[];
    reports: ReportData[];
  }>('setupMdtDebug', (data) => {
    for (const name in data.locale) Locale[name] = data.locale[name];
    setOfficers(data.officers);
    setActiveOfficers(data.officers)
    if (data.alerts !== undefined) setAlerts(data.alerts);
    if (data.units !== undefined) setUnits(data.units);
    setPersonalData(data.personalInformation);
    setAnnouncements(data.announcements);
    setProfiles(data.profiles);
    setIncidents(data.incidents);
    setReports(data.reports);
  });

  useExitListener(setVisible);

  return (
    <div className={classes.container}>
      <Transition transition='slide-up' mounted={visible}>
        {(style) => (
          <div style={{...style, display: 'flex', width: '100%', margin: 50, height: 920}}>
            <NavMenu />

            <div style={{backgroundColor: '#1c1d1f', width: 1520, borderTopRightRadius: 5, borderBottomRightRadius: 5}}>
              <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path="/profiles" element={<Profiles />} />
                <Route path="/incidents" element={<Incidents />} />
                <Route path='/reports' element={<Reports />} />
                <Route path="/dispatch" element={<Dispatch />} />
                <Route path="/evidence" element={<Evidence />} />
                <Route path="/penalcodes" element={<PenalCodes />} />
                <Route path="/roster" element={<Roster />} />
              </Routes>
            </div>
          </div>
        )}
      </Transition>
      {(!visible && isEnvBrowser()) &&
        <Button style={{color: 'black', position: 'absolute'}} variant="default" onClick={() => { setVisible(true) }}>Open</Button>
      }
    </div>
	);
}

export default App
