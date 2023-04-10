import { Box, Transition, createStyles, Navbar, Group, Code, getStylesRef, rem, Image, Center, Button } from '@mantine/core';
import { useState } from 'react';
import { Route, Routes, NavLink } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Profiles from './pages/profiles';
import Dispatch from './pages/dispatch';
import { IconLayoutDashboard, IconUserCircle, IconScript, IconFileDescription, IconBriefcase, IconLogout, IconMap2, IconUsers } from '@tabler/icons-react';
import LSPDLogo from './assets/lspd.png';
import { useNuiEvent } from './hooks/useNuiEvent';
import { AlertData, OfficerData, UnitData } from './typings';
import { useStoreOfficers } from './store/officersStore';
import { useStoreDispatch } from './store/dispatchStore';
import { useStoreUnit } from './store/unitStore';
import { useStorePersonal } from './store/personalInfoStore';
import { AnnouncementData, useStoreAnnouncements } from './store/announcementsStore';

const useStyles = createStyles((theme) => ({
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
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
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
}));

const data = [
  {link: '', label: 'Dashboard', icon: IconLayoutDashboard},
  {link: 'profiles', label: 'Profiles', icon: IconUserCircle},
  {link: 'incidents', label: 'Incidents', icon: IconScript},
  {link: 'reports', label: 'Reports', icon: IconFileDescription},
  {link: 'evidence', label: 'Evidence', icon: IconBriefcase},
  {link: 'dispatch', label: 'Dispatch', icon: IconMap2},
  {link: 'staff', label: 'Staff', icon: IconUsers},
];

function App() {
  const { classes, cx } = useStyles();
  const [visible, setVisible] = useState(true);
  const [activeLink, setActiveLink] = useState('');
  const { setOfficers } = useStoreOfficers();
  const { setAlerts } = useStoreDispatch();
  const { setUnits } = useStoreUnit();
  const { setPersonalData, firstname, lastname, callsign } = useStorePersonal();
  const { setAnnouncements } = useStoreAnnouncements();

  useNuiEvent<{alerts?: AlertData[]; officers: OfficerData[]; units?: UnitData[]; personalInformation: OfficerData; announcements: AnnouncementData[]}>('setupMdt', (data) => {
    setOfficers(data.officers);
    if (data.alerts !== undefined) setAlerts(data.alerts);
    if (data.units !== undefined) setUnits(data.units);
    setPersonalData(data.personalInformation);
    setAnnouncements(data.announcements);
  });

  const links = data.map((item) => (
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
                {links}
              </Navbar.Section>

              <Navbar.Section className={classes.footer}>
                <NavLink
                  to='/'
                  className={classes.link}
                  onClick={() => { setVisible(false); setActiveLink(''); }}
                >
                  <IconLogout className={classes.linkIcon} stroke={1.5} />
                  <span>Logout</span>
                </NavLink>
              </Navbar.Section>
            </Navbar>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path="/profiles" element={<Profiles />} />
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
