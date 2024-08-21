import { Center, Input, Loader, Stack, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { modals } from '@mantine/modals';
import { IconSearch, IconUserX } from '@tabler/icons-react';
import useIncidentStore from '../../../../../../stores/incidents/incident';
import { useOfficerStore } from '../../../../../../stores';
import { Officer } from '../../../../../../typings';
import { fetchNui } from '../../../../../../utils/fetchNui';
import locales from '../../../../../../locales';

const AddOfficerModal: React.FC = () => {
  const { incident, setOfficersInvolved } = useIncidentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const { officers, getOfficers } = useOfficerStore();
  const [filteredOfficers, setFilteredOfficers] = useState(officers);
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
      setFilteredOfficers(officers);
    } else {
      const results = officers.filter(profile => 
        (profile.citizenid || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.firstname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.lastname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.firstname + ' ' + profile.lastname || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOfficers(results);
    }
  }, [debouncedSearchQuery, officers]);

  useEffect(() => {
    getOfficers();
  }, []);

  const handleSubmit = async (officer: Officer) => {
    if (incident.officersInvolved.some(o => o.citizenid === officer.citizenid)) return modals.closeAll();

    await fetchNui('addOfficer', { id: incident.id, citizenid: officer.citizenid }, { data: 1 });
    modals.closeAll();
    setOfficersInvolved(prev => {
      if (prev.some(c => c.citizenid === officer.citizenid)) {
        return prev;
      }
      return [...prev, {
        firstname: officer.firstname,
        lastname: officer.lastname,
        callsign: officer.callsign,
        citizenid: officer.citizenid,
        playerId: officer.playerId,
        position: [1, 1, 1],
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
        ) : filteredOfficers.length > 0 ? (
          filteredOfficers.map((officer) => (
            <div className='add-officer-card' onClick={() => handleSubmit(officer)} key={officer.citizenid}>
              <Text weight={500} style={{ fontSize: 13, color: 'white' }}>
                {officer.firstname} {officer.lastname}
              </Text>

              <Text style={{ fontSize: 13, color: 'white' }}>
                {locales.callsign}: {officer.callsign}
              </Text>
            </div>
          ))
        ) : (
          <Stack spacing={0} c="dark.2" justify="center" align="center">
            <IconUserX size={36} />
            <Text size="xl">{locales.no_officers_found}</Text>
          </Stack>
        )}
      </Stack>
    </form>
  );
};

export default AddOfficerModal;
