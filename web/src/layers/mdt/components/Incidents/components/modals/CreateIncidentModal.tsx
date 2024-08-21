import { Button, Stack, TextInput } from '@mantine/core';
import React from 'react';
import { modals } from '@mantine/modals';
import { useForm } from '@mantine/form';
import useIncidentStore from '../../../../../../stores/incidents/incident';
import { fetchNui } from '../../../../../../utils/fetchNui';
import locales from '../../../../../../locales';

type FormValues = {
  title: string;
};

const CreateIncidentModal: React.FC = () => {
  const { setActiveIncident, setIncidentActive } = useIncidentStore();
  const form = useForm({
    initialValues: {
      title: '',
    },

    validate: {
      title: (value) => (value.length === 0 ? locales.incident_title_required : null),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    modals.closeAll();
    const resp = await fetchNui<number>('createIncident', values.title, { data: 1 });
    setActiveIncident({
      title: values.title,
      id: resp,
      criminals: [],
      description: '<p></p>',
      evidence: [],
      officersInvolved: [],
    });
    setIncidentActive(true);
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Stack>
        <TextInput label={locales.incident_title} data-autofocus withAsterisk {...form.getInputProps('title')} />
        <Button type="submit" fullWidth variant="light" color="gray">
          {locales.confirm}
        </Button>
      </Stack>
    </form>
  );
};

export default CreateIncidentModal;
