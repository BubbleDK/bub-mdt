import { Button, Stack, TextInput } from '@mantine/core';
import React from 'react';
import { modals } from '@mantine/modals';
import { useForm } from '@mantine/form';
import { fetchNui } from '../../../../../../utils/fetchNui';
import useReportStore from '../../../../../../stores/reports/report';
import locales from '../../../../../../locales';

type FormValues = {
  title: string;
};

const CreateReportModal: React.FC = () => {
  const { setActiveReport, setReportActive } = useReportStore();
  const form = useForm({
    initialValues: {
      title: '',
    },

    validate: {
      title: (value) => (value.length === 0 ? locales.report_title_required : null),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    modals.closeAll();
    const resp = await fetchNui<number>('createReport', values.title, { data: 1 });
    setActiveReport({
      title: values.title,
      id: resp,
      description: '<p></p>',
      officersInvolved: [],
      citizensInvolved: [],
      evidence: [],
    });
    setReportActive(true);
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Stack>
        <TextInput label={locales.report_title} data-autofocus withAsterisk {...form.getInputProps('title')} />
        <Button type="submit" fullWidth variant="light" color="gray">
          {locales.confirm}
        </Button>
      </Stack>
    </form>
  );
};

export default CreateReportModal;
