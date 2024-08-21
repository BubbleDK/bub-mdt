import React, { useState } from 'react';
import { RosterOfficer } from '../../../../../../typings';
import { Button, Stack, TextInput } from '@mantine/core';
import { fetchNui } from '../../../../../../utils/fetchNui';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import useRosterStore from '../../../../../../stores/roster/roster';
import locales from '../../../../../../locales';

interface Props {
  officer: RosterOfficer;
}

const SetCallSignModal: React.FC<Props> = ({ officer }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setRosterOfficers } = useRosterStore();

  const form = useForm({
    initialValues: {
      callsign: officer.callsign,
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        setIsLoading(true);
        const resp = await fetchNui<boolean>(
          'setOfficerCallSign',
          { citizenid: officer.citizenid, callsign: values.callsign },
          { data: true, delay: 500 }
        );
        setIsLoading(false);
        if (!resp) return form.setFieldError('callSign', locales.callsign_in_use);
        setRosterOfficers((prev) =>
          prev.map((record) =>
            record.citizenid === officer.citizenid ? { ...officer, callsign: values.callsign } : record
          )
        );
        modals.closeAll();
      })}
    >
      <Stack>
        <TextInput label={locales.callsign} {...form.getInputProps('callsign')} />
        <Button type="submit" color='gray' loading={isLoading} variant="light">
          {locales.confirm}
        </Button>
      </Stack>
    </form>
  );
};

export default SetCallSignModal;