import { Box, Transition, createStyles, Navbar, Group, Code, getStylesRef, rem, Image, Center, Button, Text, ChevronIcon, Collapse, UnstyledButton, ThemeIcon, ScrollArea } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Route, Routes, NavLink, useLocation } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Profiles from './pages/profiles';
import Dispatch from './pages/dispatch';
import { IconLayoutDashboard, IconUserCircle, IconScript, IconFileDescription, IconBriefcase, IconLogout, IconMap2, IconUsers, IconBuildingBank, IconBuildingSkyscraper, IconChartHistogram, IconSettings, IconChevronRight, IconChevronLeft, IconCode } from '@tabler/icons-react';
import LSPDLogo from './assets/lspd.png';
import { useNuiEvent } from './hooks/useNuiEvent';
import { AlertData, IncidentData, OfficerData, ProfileData, UnitData } from './typings';
import { useStoreOfficers } from './store/officersStore';
import { useStoreDispatch } from './store/dispatchStore';
import { useStoreUnit } from './store/unitStore';
import { useStorePersonal } from './store/personalInfoStore';
import { AnnouncementData, useStoreAnnouncements } from './store/announcementsStore';
import { useStoreProfiles } from './store/profilesStore';
import Incidents from './pages/incidents';
import { useStoreIncidents } from './store/incidentsStore';

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  main: {
    width: '95%',
    height: '95%',
    backgroundColor: theme.colors.dark[8],
    borderRadius: theme.radius.sm,
    display: 'flex',
  },

  header: {
    marginTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.xs})`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      [`& .${getStylesRef('icon')}`]: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      [`& .${getStylesRef('icon')}`]: {
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      },
    },
  },

  chevron: {
    transition: 'transform 200ms ease',
  },
}));

const data = [
  {link: '', label: 'Dashboard', icon: IconLayoutDashboard},
  {link: 'profiles', label: 'Profiles', icon: IconUserCircle},
  {link: 'incidents', label: 'Incidents', icon: IconScript},
  {link: 'reports', label: 'Reports', icon: IconFileDescription},
  {link: 'evidence', label: 'Evidence', icon: IconBriefcase},
  {link: 'properties', label: 'Propterties', icon: IconBuildingSkyscraper},
  {link: 'dispatch', label: 'Dispatch', icon: IconMap2},
  {link: 'businesses', label: 'Businesses', icon: IconBuildingBank},
  {label: 'Staff', icon: IconUsers, links: [
    { label: 'Staff', link: 'staff', icon: IconUsers }, 
    { label: '10 codes / commands', link: '10-codes', icon: IconCode },
    { label: 'Statistics', link: 'statistics', icon: IconChartHistogram },
  ]},
];

function App() {
  const { classes, cx, theme } = useStyles();
  const [visible, setVisible] = useState(true);
  const [activeLink, setActiveLink] = useState('');
  const location = useLocation();
  const { setOfficers } = useStoreOfficers();
  const { setAlerts } = useStoreDispatch();
  const { setUnits } = useStoreUnit();
  const { setPersonalData, firstname, lastname, callsign } = useStorePersonal();
  const { setAnnouncements } = useStoreAnnouncements();
  const { setProfiles } = useStoreProfiles();
  const { setIncidents } = useStoreIncidents();
  const [opened, setOpened] = useState(false);
  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft;

  useNuiEvent<{alerts?: AlertData[]; officers: OfficerData[]; units?: UnitData[]; personalInformation: OfficerData; announcements: AnnouncementData[]; profiles: ProfileData[]; incidents: IncidentData[]}>('setupMdt', (data) => {
    setOfficers(data.officers);
    if (data.alerts !== undefined) setAlerts(data.alerts);
    if (data.units !== undefined) setUnits(data.units);
    setPersonalData(data.personalInformation);
    setAnnouncements(data.announcements);
    setProfiles(data.profiles);
    setIncidents(data.incidents);
  });

  useEffect(() => {
    setActiveLink(location.pathname.split('/')[1]);
  }, [location]);

  const links = data.map((item) => (
    <>
      {item.links === undefined ? (
        <NavLink
          key={item.label}
          to={`/${item.link}`}
          onClick={() => {
            setActiveLink(item.link);
          }}
          className={cx(classes.link, {[classes.linkActive]: activeLink === item.link})}
        >
          <item.icon className={classes.linkIcon} stroke={1.5}/>
          <span>{item.label}</span>
        </NavLink>
      ) : (
        <>
          <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
            <Group position="apart" spacing={0}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <item.icon className={classes.linkIcon} stroke={1.5}/>
                <span>{item.label}</span>
              </Box>
              {item.links && (
                <ChevronIcon
                  className={classes.chevron}
                  size="1rem"
                  stroke={1.5}
                  style={{
                    transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none',
                  }}
                />
              )}
            </Group>
          </UnstyledButton>
            {item.links ? <Collapse in={opened}>{item.links.map((link) => (
              <NavLink
                key={link.label}
                to={`/${link.link}`}
                onClick={() => {
                  setActiveLink(link.link);
                }}
                className={cx(classes.link, {[classes.linkActive]: activeLink === link.link})}
                style={{ marginLeft: rem(26), paddingLeft: rem(31), padding: `${theme.spacing.xs} ${theme.spacing.md}`, borderLeft: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`}}
              >
                <link.icon className={classes.linkIcon} stroke={1.5}/>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </Collapse> : null}
        </>
      )}
    </>
  ));

  return (
    <Box className={classes.container}>
      <Transition transition='slide-up' mounted={visible}>
        {(style) => (
          <Box className={classes.main} style={style}>
            <Navbar height={"100%"} width={{ sm: 300 }} p='sm'>
              <Navbar.Section grow>
                <Center>
                  <Image
                    radius={"md"}
                    width={200}
                    height={200}
                    src={LSPDLogo}
                    alt='LSPD Logo'
                  />
                </Center>
                <Group className={classes.header} position='apart'>
                  <Code sx={{ fontWeight: 700 }}>{callsign} | {firstname} {lastname}</Code>
                </Group>
                <ScrollArea h={553} scrollbarSize={2}>
                  {links}
                </ScrollArea>
              </Navbar.Section>

              <Navbar.Section className={classes.footer}>
                <Group position='left' spacing={1}>
                  <NavLink
                    to='/'
                    className={classes.link}
                    style={{ width: 119 }}
                    onClick={() => { setVisible(false); setActiveLink(''); }}
                  >
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>Logout</span>
                  </NavLink>
                  <NavLink
                    to='configuration'
                    className={cx(classes.link, {[classes.linkActive]: activeLink === 'configuration'})}
                    onClick={() => { setActiveLink('configuration'); }}
                  >
                    <IconSettings className={classes.linkIcon} stroke={1.5} />
                    <span>Configurations</span>
                  </NavLink>
                </Group>
              </Navbar.Section>
            </Navbar>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path="/profiles" element={<Profiles />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/dispatch" element={<Dispatch />} />
            </Routes>
          </Box>
        )}
      </Transition>
      {!visible &&
        <Button style={{color: 'black'}} variant="default" onClick={() => { setVisible(true) }}>Open</Button>
      }
    </Box>
	);
}

export default App
