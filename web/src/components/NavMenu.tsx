import React, { useEffect, useState } from 'react'
import { Box, createStyles, Navbar, Group, getStylesRef, rem, Image, Center, Text, Collapse, UnstyledButton, ScrollArea, Divider, Menu } from '@mantine/core';
import { NavLink, useLocation } from 'react-router-dom';
import { IconLayoutDashboard, IconUserCircle, IconBuildingBank, IconSlice, IconVideo, IconCar, IconScript, IconFileDescription, IconBriefcase, IconZoomExclamation, IconMap2, IconUsers, IconPointFilled, IconBuildingSkyscraper, IconChartHistogram, IconSettings, IconCode, IconDotsVertical, IconDoorExit, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Locale } from '../store/locale';
import { fetchNui } from '../utils/fetchNui';
import LSPDLogo from '../assets/lspd.png';
import { useStorePersonal } from '../store/personalInfoStore';
import { useVisibility } from '../store/visibilityStore';

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.xs}`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      borderRadius: theme.radius.sm,
      background: 'linear-gradient(90deg, rgba(51,124,255,0.5) 0%, rgba(187,187,187,0) 100%)',
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.xs,
    color: theme.colors.gray[2],
    padding: `${theme.spacing.xs} ${theme.spacing.xs}`,
    fontWeight: 500,

    '&:hover': {
      borderRadius: theme.radius.sm,
      background: 'linear-gradient(90deg, rgba(51,124,255,0.5) 0%, rgba(187,187,187,0) 100%)',
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
      borderRadius: theme.radius.sm,
      background: 'linear-gradient(90deg, rgba(51,124,255,0.5) 0%, rgba(187,187,187,0) 100%)',
      [`& .${getStylesRef('icon')}`]: {
        color: 'white',
      },
    },
  },

  chevron: {
    transition: 'transform 200ms ease',
  },
}));

const homeData = [
  {link: '', label: 'Dashboard', icon: IconLayoutDashboard},
]

const pagesData = [
  {link: 'profiles', label: 'Profiles', icon: IconUserCircle},
  {link: 'incidents', label: 'Incidents', icon: IconScript},
  {link: 'reports', label: 'Reports', icon: IconFileDescription},
  {link: 'dispatch', label: 'Dispatch', icon: IconMap2},
  {link: 'boloWarrants', label: 'Bolos & Warrants', icon: IconZoomExclamation},
  {link: 'vehicles', label: 'Vehicles', icon: IconCar},
  {link: 'evidence', label: 'Evidence', icon: IconBriefcase},
  {
    links: [
      { link: 'businesses', label: 'Businesses', icon: IconBuildingBank },
      { link: 'properties', label: 'Propterties', icon: IconBuildingSkyscraper },
      { link: 'cameras', label: 'Cameras', icon: IconVideo },
      { link: 'weaponRegistry', label: 'Weapon Registery', icon: IconSlice },
    ], 
    label: 'Others', 
    icon: IconPointFilled
  },
]

const staffData = [
  { label: 'Roster', link: 'roster', icon: IconUsers }, 
  { label: '10 codes / commands', link: '10Codes', icon: IconCode },
  { label: 'Statistics', link: 'statistics', icon: IconChartHistogram },
]

const NavMenu = () => {
  const { classes, cx, theme } = useStyles();
  const [activeLink, setActiveLink] = useState('');
  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft;
  const [opened, setOpened] = useState(false);
  const { firstname, lastname, callsign, role } = useStorePersonal();
  const setVisible = useVisibility((state) => state.setVisible);
  const location = useLocation();
  const homeLinks = homeData.map((item) => (
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

  const pagesLinks = pagesData.map((item) => (
		<>
			{item.links === undefined ? (
				<NavLink
					key={item.link}
					to={`/${item.link}`}
					onClick={() => {
						setActiveLink(item.link);
					}}
					className={cx(classes.link, {
						[classes.linkActive]: activeLink === item.link,
					})}
				>
					<item.icon className={classes.linkIcon} stroke={1.5} />
					<span>{item.label}</span>
				</NavLink>
			) : (
				<>
					<UnstyledButton
						onClick={() => setOpened((o) => !o)}
						className={classes.control}
					>
						<Group position='apart' spacing={0}>
							<Box sx={{ display: "flex", alignItems: "center" }}>
								<item.icon className={classes.linkIcon} stroke={1.5} />
								<span>{item.label}</span>
							</Box>
							{item.links && (
								<ChevronIcon
									className={classes.chevron}
									size='1rem'
									stroke={1.5}
									style={{
										transform: opened
											? `rotate(${theme.dir === "rtl" ? -90 : 90}deg)`
											: "none",
									}}
								/>
							)}
						</Group>
					</UnstyledButton>
					{item.links ? (
						<Collapse in={opened}>
							{item.links.map((link) => (
								<NavLink
									key={link.label}
									to={`/${link.link}`}
									onClick={() => {
										setActiveLink(link.link);
									}}
									className={cx(classes.link, {
										[classes.linkActive]: activeLink === link.link,
									})}
									style={{
										marginLeft: rem(20),
										paddingLeft: rem(20),
										padding: `${theme.spacing.xs} ${theme.spacing.md}`,
										borderLeft: `${rem(1)} solid ${
											theme.colorScheme === "dark"
												? theme.colors.dark[4]
												: theme.colors.gray[3]
										}`,
									}}
								>
									<link.icon className={classes.linkIcon} stroke={1.5} />
									<span>{link.label}</span>
								</NavLink>
							))}
						</Collapse>
					) : null}
				</>
			)}
		</>
	));

  const staffLinks = staffData.map((item) => (
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

  useEffect(() => {
    setActiveLink(location.pathname.split('/')[1]);
  }, [location]);

  return (
    <Navbar height={"100%"} width={{ sm: 300 }} p='xs' style={{backgroundColor: '#242527', borderTopLeftRadius: 5, borderBottomLeftRadius: 5}}>
      <Navbar.Section grow>
        <Center>
          <Image radius={"md"} width={150} height={150} src={LSPDLogo} alt='LSPD Logo' />
        </Center>
        <Divider my="sm" />
        <ScrollArea h={650} scrollbarSize={2}>
          <Text size="xs" weight={500} color="dimmed" style={{margin: 8}}>
            Home
          </Text>
          {homeLinks}
          <Text size="xs" weight={500} color="dimmed" style={{margin: 8}}>
            Pages
          </Text>
          {pagesLinks}
          <Text size="xs" weight={500} color="dimmed" style={{margin: 8}}>
            Staff
          </Text>
          {staffLinks}
        </ScrollArea>
      </Navbar.Section>
      <Box sx={{paddingTop: 5, borderTop: `${rem(1)} solid ${ theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`}}>
        <Menu shadow="md" width={200} withArrow position='top-end'>
          <Menu.Target>
            <UnstyledButton
              sx={{
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                '&:hover': {
                  backgroundColor:
                    theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
                },
              }}
            >
              <Group>
                <Box sx={{ flex: 1 }}>
                  <Text size="sm" weight={500}>
                    {firstname} {lastname}
                  </Text>
                  <Text color="dimmed" size="xs">
                    {role} | {callsign}
                  </Text>
                </Box>

                <IconDotsVertical size={rem(18)} />
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item icon={<IconSettings size={14} />}>
              <NavLink to={`/configuration`} style={{ textDecoration: 'none', color: '#C1C2C5' }}>
                <span>Configuration</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item icon={<IconDoorExit size={14} />} onClick={() => { setVisible(false); fetchNui('exit'); }}>{Locale.ui_logout}</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    </Navbar>
  )
}

export default NavMenu