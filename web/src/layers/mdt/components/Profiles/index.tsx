import './index.css'
import ProfileExtraInformation from './components/ProfileExtraInformation';
import ProfileInformation from './components/ProfileInformation';
import ProfileList from './components/ProfileList';
import { LoadingOverlay } from '@mantine/core';
import CustomLoader from '../CustomLoader';
import { useState } from 'react';
import { useProfilesStore } from '../../../../stores';
import { PartialProfileData, Profile } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { DEBUG_PROFILE } from '../../../../stores/profilesStore';

const Profiles = () => {
  const [loading, setLoading] = useState(false);
  const { setIsProfileWanted, setSelectedProfile } = useProfilesStore();

  const handleProfileClick = async (profile: PartialProfileData) => {
    setLoading(true);
    setSelectedProfile(null);
    setIsProfileWanted(false);
    const resp = await fetchNui<Profile>('getProfile', profile.citizenid, {
      data: {
        ...DEBUG_PROFILE,
        firstName: profile.firstname,
        lastName: profile.lastname,
        citizenid: profile.citizenid,
      },
    });

    const isProfileWanted = await fetchNui<boolean>('isProfileWanted', profile.citizenid, {
      data: false,
    });

    setLoading(false);
    setSelectedProfile(resp);
    setIsProfileWanted(isProfileWanted)
  }

  return (
		<div className='profiles'>
      <ProfileList handleProfileClick={handleProfileClick} />

      <LoadingOverlay visible={loading} overlayOpacity={0.97} overlayColor={"rgb(34, 35, 37)"} transitionDuration={250} loader={CustomLoader} style={{left: 795, width: 935, height: '96%', top: 19, borderRadius: '0.25rem'}} />
      <ProfileInformation />
      <ProfileExtraInformation />
		</div>
	);
}

export default Profiles;