import { Center, Input, Loader, ScrollArea, Stack, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { modals } from '@mantine/modals';
import { IconSearch, IconUserX } from '@tabler/icons-react';
import { useProfilesStore } from '../../../../../../stores';
import { PartialProfileData } from '../../../../../../typings';
import { fetchNui } from '../../../../../../utils/fetchNui';
import useReportStore from '../../../../../../stores/reports/report';
import locales from '../../../../../../locales';

const AddCitizenModal: React.FC = () => {
  const { report, setCitizensInvolved } = useReportStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles, setProfiles] = useState<PartialProfileData[]>([]);
  const { getPlayers } = useProfilesStore();
  const [filteredProfiles, setFilteredProfiles] = useState(profiles);
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
      setFilteredProfiles(profiles);
    } else {
      const results = profiles.filter(profile => 
        (profile.citizenid || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.firstname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.lastname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.firstname + ' ' + profile.lastname || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProfiles(results);
    }
  }, [debouncedSearchQuery, profiles]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      return await getPlayers();
    };

    fetchData().then((data) => {
      setProfiles(data.profiles);
      setFilteredProfiles(data.profiles);
      setIsLoading(false);
    });
  }, [])

  const handleSubmit = async (citizen: PartialProfileData) => {
    if (report.citizensInvolved.some(o => o.citizenid === citizen.citizenid)) return modals.closeAll();

    await fetchNui('addReportCitizen', { id: report.id, citizenid: citizen.citizenid }, { data: 1 });
    modals.closeAll();
    setCitizensInvolved(prev => {
      if (prev.some(c => c.citizenid === citizen.citizenid)) {
        return prev;
      }
      return [...prev, {
        ...citizen
      }];
    });
  };

  return (
    <form>
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
          <ScrollArea h={280}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredProfiles.map((profile) => (
                <div className='add-officer-card' onClick={() => handleSubmit(profile)} key={profile.citizenid}>
                  <Text weight={500} style={{ fontSize: 13, color: 'white' }}>
                    {profile.firstname} {profile.lastname}
                  </Text>

                  <Text style={{ fontSize: 13, color: 'white' }}>
                    {locales.citizen_id}: {profile.citizenid}
                  </Text>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <Stack spacing={0} c="dark.2" justify="center" align="center">
            <IconUserX size={36} />
            <Text size="xl">{locales.no_citizens_found}</Text>
          </Stack>
        )}
    </form>
  );
};

export default AddCitizenModal;
