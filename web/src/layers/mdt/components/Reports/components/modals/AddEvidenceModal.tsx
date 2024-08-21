import React, { useState } from 'react';
import { ActionIcon, Button, Stack, Text, TextInput, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useForm } from '@mantine/form';
import { fetchNui } from '../../../../../../utils/fetchNui';
import useReportStore from '../../../../../../stores/reports/report';
import { IconCamera } from '@tabler/icons-react';
import locales from '../../../../../../locales';

const AddEvidenceModal: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { report, setEvidence } = useReportStore();

  const form = useForm({
    initialValues: {
      label: '',
      image: '',
    },

    validate: {
      label: (value) => (value.length === 0 ? locales.image_label_required : null),
      image: (value) => (value.length === 0 ? locales.image_url_required : null),
    },
  });

  const handleSubmit = async (values: { label: string; image: string }) => {
    setIsLoading(true);
    await fetchNui('addReportEvidence', { id: report.id, evidence: { ...values } }, { data: 1 });
    setEvidence((prev) => [...prev, values]);
    setIsLoading(false);
    modals.closeAll();
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Stack>
        <TextInput label={"Image label"} withAsterisk {...form.getInputProps('label')} />
        <TextInput
          label={
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 5 }}>
              <Text>{locales.image_url}</Text>
              <Tooltip label={locales.take_picture} withArrow color='gray'>
                <ActionIcon 
                  disabled={form.getInputProps('label').value === ''}
                  variant="default" 
                  size="sm" 
                  p={1.5} 
                  onClick={async () => { 
                    await fetchNui('takePicture', { id: report.id, imageLabel: form.getInputProps('label').value, type: 'report' }, { data: 1 });
                  }}
                >
                  <IconCamera size="1.125rem" />
                </ActionIcon>
              </Tooltip>
            </div>
          }
          placeholder="https://i.imgur.com/dqopYB9b.jpg"
          {...form.getInputProps('image')}
        />
        
        <Button variant="light" color="gray" type="submit" loading={isLoading}>
          {locales.add_image}
        </Button>
      </Stack>
    </form>
  );
};

export default AddEvidenceModal;