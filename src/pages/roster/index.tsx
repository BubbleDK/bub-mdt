import React, { useState } from 'react'
import { Button, Group, Modal, Select, Text, TextInput, createStyles } from '@mantine/core';
import { keys } from '@mantine/utils';
import { IconPlus } from '@tabler/icons-react';
import { useStoreOfficers } from '../../store/officersStore';
import RosterTable from './components/RosterTable';
import { useForm } from '@mantine/form';
import { OfficerData } from '../../typings';

const useStyles = createStyles((theme) => ({
  roster: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    padding: 50,
  },

  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
  }
}))

function filterData(data: OfficerData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

const Roster = () => {
  const { classes, cx } = useStyles();
  const { officers } = useStoreOfficers();
  const [fireModalOpened, setFireModalOpened] = useState(false);
  const form = useForm({
    initialValues: {
      citizenid: '',
      role: '',
      image: '',
    },
  });
  const [sortedData, setSortedData] = useState(officers);
  const [search, setSearch] = useState('');

  const handleSubmit = () => {
    console.log('submitted');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(filterData(officers, value ));
  };

  return (
    <>
      <Modal opened={fireModalOpened} onClose={() => setFireModalOpened(false)} yOffset={300} xOffset={0} title={<Text size="lg">Add officer</Text>}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            data-autofocus
            placeholder="Enter citizen ID"
            label="CitizenID"
            {...form.getInputProps('citizenid')}
          />

          <Select
            label="Choose a role"
            placeholder="Pick a role"
            withinPortal={true}
            dropdownPosition="bottom"
            data={[
              { value: 'chief', label: 'Chief' },
              { value: 'captain', label: 'Captain' },
              { value: 'lieutenant', label: 'Lieutenant' },
              { value: 'sergeant', label: 'Sergeant' },
              { value: 'corporal', label: 'Corporal' },
              { value: 'officer', label: 'Officer' },
              { value: 'cadet', label: 'Cadet' },
            ]}
          />

          <TextInput
            placeholder="Insert image URL"
            label="Image"
            {...form.getInputProps('image')}
          />
        </form>
        <Group position="right" mt={20}>
          <Button onClick={() => {  }} style={{}}>
            Hire
          </Button>
        </Group>
      </Modal>
      <div className={classes.roster}>
        <div className={classes.topbar}>
          <div>
            <Text style={{fontSize: 12}} weight={500} c="dimmed">
              Manage roster here
            </Text>

            <Text style={{fontSize: 24, color: 'white'}} weight={500}>
              Roster
            </Text>
          </div>
          <div style={{display: 'flex', gap: 15, alignItems: 'center'}}>
            <Text style={{fontSize: 13, textAlign: 'center'}} weight={500} c="dimmed">
              {officers.length} members
            </Text>

            <TextInput
              placeholder="Search..."
              variant="filled"
              value={search}
              onChange={handleSearchChange}
            />
            
            <Button leftIcon={<IconPlus />} style={{backgroundColor: 'rgba(51, 124, 255, 0.2)', color: 'rgba(159, 194, 255, 1)'}} onClick={() => {setFireModalOpened(true)}}>
              Add member
            </Button>
          </div>
        </div>

        <RosterTable officers={sortedData} />
      </div>
    </>
  )
}

export default Roster;