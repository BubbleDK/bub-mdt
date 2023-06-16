import React, { useEffect, useState } from 'react'
import {Container, Flex, LoadingOverlay, Stack, DEFAULT_THEME, Alert, Transition, createStyles } from "@mantine/core";
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
import customLoader from '../../components/customLoader';

const useStyles = createStyles((theme) => ({
  profiles: {
    height: 880,
    margin: 20,
    display: 'flex',
    gap: 15
  },
}));

const Profiles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setProfile, selectedProfile, replaceProfile } = useStoreProfiles();
  const [opened, { toggle, close }] = useDisclosure(false);
  const { addToRecentActivity } = useRecentActivityStore();
  const { firstname, lastname } = useStorePersonal();
  const { classes, cx } = useStyles();

  useEffect(() => {
    if (!selectedProfile) return;
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
    replaceProfile(props ? props : {} as ProfileData);

    setTimeout(() => {
      close();
    }, 2000)
  }

  return (
    <div className={classes.profiles}>
      <SearchTable onClick={setProfileClick}  />
      <Stack sx={(theme) => ({ gap: 12 })}>
        <LoadingOverlay visible={isLoading} overlayOpacity={0.95} overlayColor={"rgb(34, 35, 37)"} transitionDuration={250} loader={customLoader} style={{left: 705, width: '60.25%', height: '96%', top: 19, borderRadius: '0.25rem'}} />
        <ProfileInformation onClick={setProfileClick} saveProfile={saveProfileClick} />
        <Flex gap="md" justify="flex-start" align="center" direction="row" wrap="wrap">
          <RelatedIncidents />
          <InvolvedIncidents />
        </Flex>
      </Stack>

      <Transition mounted={opened} transition={'scale'} duration={200} timingFunction="ease">
        {(styles) => (
          <Alert style={{...styles, position: 'fixed', bottom: 15, left: '50%', transform: 'translateX(-50%)', width: 400}} icon={<IconAlertCircle size="1rem" />} color="green" radius="xs" variant="filled">
            You sucessfully updated the profile
          </Alert>
        )}
      </Transition>
    </div>
  )
}

export default Profiles;