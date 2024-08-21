import React, { useEffect, useState } from 'react';
import { Button, Center, Loader, Text, TextInput } from '@mantine/core';
import './index.css';
import { IconUserPlus } from '@tabler/icons-react';
import RosterTable from './components/RosterTable';
import { usePersonalDataStore } from '../../../../stores';
import useRosterStore from '../../../../stores/roster/roster';
import { modals } from '@mantine/modals';
import HireOfficerModal from './components/modals/HireOfficerModal';
import locales from '../../../../locales';

const Roster = () => {
  const { rosterOfficers, getRosterOfficers } = useRosterStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOfficers, setFilteredOfficers] = useState(rosterOfficers);
  const DEBOUNCE_DELAY = 200;
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [timer, setTimer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const personalRole = usePersonalDataStore(state => state.personalData.role);

  function checkPermissionForRole(personalRole: string): boolean {
    if (personalRole === 'Chief' || personalRole === 'Assistant Chief' || personalRole === 'Captain' || personalRole === 'Lieutenant' || personalRole === 'Sergeant') {
      return false;
    } else {
      return true;
    }
  }

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
      setFilteredOfficers(rosterOfficers);
    } else {
      const results = rosterOfficers.filter(officer => 
        (officer.firstname || '').toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
        (officer.lastname || '').toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
      );
      setFilteredOfficers(results);
    }
  }, [debouncedSearchQuery, rosterOfficers]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      return await getRosterOfficers();
    };

    fetchData().then(() => {
      setIsLoading(false);
    });
  }, [])

  return (
    <div className='roster'>
      <div className='roster-top'>
        <div>
          <Text style={{fontSize: 12}} weight={500} c="dimmed">
            {locales.manage_roster}
          </Text>

          <Text style={{fontSize: 24, color: 'white'}} weight={500}>
            {locales.roster}
          </Text>
        </div>

        <div className='roster-top-right' style={{display: 'flex', gap: 15, alignItems: 'center'}}>
          <Text style={{fontSize: 13, textAlign: 'center'}} weight={500} c="dimmed">
            {rosterOfficers.length} {locales.members}
          </Text>

          <TextInput
            placeholder={locales.search}
            variant="filled"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          
          <Button 
            leftIcon={<IconUserPlus size={20} />} 
            style={{backgroundColor: 'rgba(51, 124, 255, 0.2)', color: 'rgba(159, 194, 255, 1)'}} 
            onClick={() => modals.open({ title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.hire_officer}</Text>, centered: true, size: 'xs', children: <HireOfficerModal /> })}
            disabled={checkPermissionForRole(personalRole)}
          >
            {locales.hire_officer}
          </Button>
        </div>
      </div>

      <div className='roster-list'>
        {isLoading ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          <RosterTable officers={filteredOfficers} hasPermission={checkPermissionForRole(personalRole)} />
        )}
      </div>
    </div>
  )
}

export default Roster;