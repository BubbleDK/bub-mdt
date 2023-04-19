import React, { useEffect, useState } from 'react'
import {Container, Flex, LoadingOverlay, Stack, DEFAULT_THEME, Dialog, Alert, Transition } from "@mantine/core";
import SearchTable from './components/SearchTable';
import ProfileInformation from './components/ProfileInformation';
import RelatedIncidents from './components/RelatedIncidents';
import InvolvedIncidents from './components/InvolvedIncidents';
import { ProfileData } from '../../typings';
import { useStoreProfiles } from '../../store/profilesStore';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertCircle } from '@tabler/icons-react';
import { useRecentActivityStore } from '../../store/recentActivity';
import { useStorePersonal } from '../../store/personalInfoStore';

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

const Profiles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setProfile, selectedProfile } = useStoreProfiles();
  const [opened, { toggle, close }] = useDisclosure(false);
  const { addToRecentActivity } = useRecentActivityStore();
  const { firstname, lastname } = useStorePersonal();

  useEffect(() => {
    let mountedSelectedProfile = selectedProfile;
    setProfile(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setProfile(mountedSelectedProfile);
    }, 650)
  }, []);

  const setProfileClick = (props: ProfileData | null) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setProfile(props);
    }, 650)
  }

  const saveProfileClick = (props: ProfileData | null) => {
    toggle();
    addToRecentActivity({ category: 'Profiles', type: 'Updated', doneBy: firstname + ' ' + lastname, timeAgo: new Date().valueOf(), timeAgotext: '', activityID: props?.citizenid });

    setTimeout(() => {
      close();
    }, 2000)
  }

  return (
    <Container w={'100%'} p={15} style={{maxWidth: '100%'}}>
      <Flex
        gap="md"
        justify="flex-start"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <SearchTable onClick={setProfileClick}  />
        <Stack h={890} sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0], gap: 10 })}>
          <LoadingOverlay visible={isLoading} overlayOpacity={0.95} transitionDuration={250} loader={customLoader} style={{left: 690, width: '61.5%', height: '97%', top: 15}} />
          <ProfileInformation onClick={setProfileClick} saveProfile={saveProfileClick} />
          <Flex gap="md" justify="flex-start" align="center" direction="row" wrap="wrap">
            <RelatedIncidents />
            <InvolvedIncidents />
          </Flex>
        </Stack>
      </Flex>

      <Transition mounted={opened} transition={'scale'} duration={200} timingFunction="ease">
        {(styles) => (
          <Alert style={{...styles, position: 'fixed', bottom: 15, left: '50%', transform: 'translateX(-50%)', width: 400}} icon={<IconAlertCircle size="1rem" />} color="green" radius="xs" variant="filled">
            You sucessfully updated the profile
          </Alert>
        )}
      </Transition>
    </Container>
  )
}

export default Profiles;