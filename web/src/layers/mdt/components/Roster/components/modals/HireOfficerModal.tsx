import React, { useState } from 'react';
import { Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { fetchNui } from '../../../../../../utils/fetchNui';
import { modals } from '@mantine/modals';
import useRosterStore from '../../../../../../stores/roster/roster';
import locales from '../../../../../../locales';

const HireOfficerModal: React.FC = () => {
  const { getRosterOfficers } = useRosterStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      citizenid: '',
      callsign: '',
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        setIsLoading(true);
        const resp = await fetchNui<boolean>('hireOfficer', { citizenid: values.citizenid, callsign: values.callsign, lastActive: Date.now() } , { data: false, delay: 500 });
        setIsLoading(false);
        if (!resp) return form.setFieldError('citizenid', locales.citizen_id_already_hired);
        await getRosterOfficers();
        modals.closeAll();
      })}
    >
      <Stack>
        <TextInput
          label={locales.citizen_id}
          description={locales.citizen_id_you_want_to_hire}
          required
          {...form.getInputProps('citizenid')}
        />
        <TextInput
          label={locales.callsign}
          description={locales.callsign_you_want_to_hire}
          required
          {...form.getInputProps('callsign')}
        />
        <Button variant="light" color='gray' type="submit" loading={isLoading}>
          {locales.confirm}
        </Button>
      </Stack>
    </form>
  );
};

export default HireOfficerModal;