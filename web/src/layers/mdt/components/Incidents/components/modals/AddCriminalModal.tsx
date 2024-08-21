import { Center, Image, Input, Loader, Stack, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { modals } from '@mantine/modals';
import { IconSearch, IconUserX } from '@tabler/icons-react';
import useIncidentStore from '../../../../../../stores/incidents/incident';
import useCriminalProfileStore from '../../../../../../stores/incidents/addCriminal';
import { shuffleArray } from '../../../../../../helpers/shuffleArray';
import { CriminalProfile } from '../../../../../../typings';
import { fetchNui } from '../../../../../../utils/fetchNui';
import locales from '../../../../../../locales';

const AddCriminalModal: React.FC = () => {
  const { incident, setCriminals } = useIncidentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const { criminalProfiles, getCriminalProfiles } = useCriminalProfileStore();
  const [filteredProfiles, setFilteredProfiles] = useState(criminalProfiles);
  const DEBOUNCE_DELAY = 500;
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    if (timer !== null) {
      clearTimeout(timer);
    }

    setIsLoading(true);

    const newTimer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsLoading(false);
    }, DEBOUNCE_DELAY);

    setTimer(newTimer);

    return () => {
      clearTimeout(newTimer);
    };
}, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery.trim() === '') {
      setFilteredProfiles(shuffleArray([...criminalProfiles]).slice(0, 5));
    } else {
      const results = criminalProfiles.filter(profile => 
        (profile.citizenid || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.firstname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.lastname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.firstname + ' ' + profile.lastname || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProfiles(results);
    }
  }, [debouncedSearchQuery, criminalProfiles]);

  useEffect(() => {
    const fetchData = async () => {
      await getCriminalProfiles();
    };
    fetchData();
  }, []);

  const handleSubmit = async (profile: CriminalProfile) => {
    await fetchNui('addCriminal', { id: incident.id, criminalId: profile.citizenid }, { data: 1 });
    modals.closeAll();
    setCriminals(prev => {
      if (prev.some(c => c.citizenid === profile.citizenid)) {
        return prev;
      }
      return [...prev, {
        citizenid: profile.citizenid,
        dob: profile.dob,
        firstname: profile.firstname,
        lastname: profile.lastname,
        image: profile.image,
        charges: [],
        issueWarrant: false,
        pleadedGuilty: false,
        processed: false,
        penalty: { time: 0, reduction: 0, points: 0, fine: 0 },
      }];
    });
  };

  return (
    <form>
      <Stack>
        <Input
          icon={<IconSearch />}
          variant="filled"
          placeholder={locales.search}
          mt={10}
          mb={10}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        {isLoading ? (
          <Center>
            <Loader />
          </Center>
        ) : filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile) => (
            <div className='profile-card' onClick={() => handleSubmit(profile)} key={profile.citizenid}>
              <Image width={65} height={65} src={profile.image ?? 'https://cdn.vectorstock.com/i/preview-1x/97/68/account-avatar-dark-mode-glyph-ui-icon-vector-44429768.jpg'} radius={'lg'} alt="With default placeholder" withPlaceholder />

              <div>
                <Text weight={600} style={{ fontSize: 13, color: 'white' }}>
                  {profile.firstname} {profile.lastname}
                </Text>

                <Text style={{ fontSize: 12, color: 'white' }}>
                  {locales.dob}: {profile.dob}
                </Text>
                
                <Text style={{ fontSize: 12, color: 'white' }}>
                  {locales.citizen_id}: {profile.citizenid}
                </Text>
              </div>
            </div>
          ))
        ) : (
          <Stack spacing={0} c="dark.2" justify="center" align="center">
            <IconUserX size={36} />
            <Text size="xl">{locales.no_profiles_found}</Text>
          </Stack>
        )}
      </Stack>
    </form>
  );
};

export default AddCriminalModal;
