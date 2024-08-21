import React, { useEffect, useState } from 'react';
import { Button, Loader, MultiSelect, Stack } from '@mantine/core';
import { fetchNui } from '../../../../../../utils/fetchNui';
import { Officer } from '../../../../../../typings';
import { modals } from '@mantine/modals';
import locales from '../../../../../../locales';

interface Props {
  id: number;
  members: Officer[];
}

const ManageOfficersModal: React.FC<Props> = (props) => {
  const [value, setValue] = useState<string[]>([]);
  const [allOfficers, setAllOfficers] = useState<Officer[]>([])
  const [isLoading, setIsLoading] = useState(false);

  const getActiveOfficers = async () => {
    setIsLoading(true);
    const resp = await fetchNui<Officer[]>('getActiveOfficers', null, { data: [
      {
        firstname: 'John',
        lastname: 'Doe',
        callsign: '1A-01',
        citizenid: 'ABCD1234',
        playerId: 1,
        position: [0, 0, 0],
        unitId: 1
      },
      {
        firstname: 'Jenna',
        lastname: 'Doe',
        callsign: '1A-02',
        citizenid: 'ABCD1235',
        playerId: 2,
        position: [0, 0, 0],
      },
    ], delay: 1500 });
    const officersArray = Object.values(resp);
    setAllOfficers(officersArray);
    setIsLoading(false);
  }

  useEffect(() => {
    setValue(props.members.map((member) => member.playerId.toString()));
  }, [props]);

  useEffect(() => {
    getActiveOfficers();
  }, [])

  const officers = allOfficers.map((officer) => ({
    label: `${officer.firstname} ${officer.lastname} (${officer.callsign})`,
    value: officer.playerId.toString(),
  }));

  return (
    <Stack>
      <MultiSelect
        data={officers || []}
        searchable
        value={value}
        onChange={setValue}
        label={locales.unit_officers}
        description={locales.unit_officers_description}
        readOnly={isLoading}
        rightSection={isLoading ? <Loader size="sm" /> : null}
      />
      <Button
        color="gray"
        variant="light"
        onClick={async () => {
          await fetchNui('setUnitOfficers', { id: props.id, officers: value });
          modals.closeAll();
        }}
      >
        {locales.confirm}
      </Button>
    </Stack>
  );
};

export default ManageOfficersModal;