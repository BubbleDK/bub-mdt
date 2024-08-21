import React, { useState } from 'react';
import { Button, Stack, Textarea, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import useVehiclesStore from '../../../stores/vehicles/vehicles';
import { fetchNui } from '../../../utils/fetchNui';
import locales from '../../../locales';
import { useForm } from '@mantine/form';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';

interface Props {
  plate?: string;
}

const CreateBoloModal: React.FC<Props> = (props) => {
  const { selectedVehicle, setBOLOExpirationDate, setIsVehicleBOLO } = useVehiclesStore();
  const [value, setValue] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      plate: props.plate ? props.plate : '',
      reason: '',
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        if (!selectedVehicle) return;
        setIsLoading(true);
        await fetchNui<boolean>('createBOLO', { plate: values.plate, reason: values.reason, expirationDate: dayjs(value).format('YYYY-MM-DD HH:mm:ss') } , { data: false, delay: 500 });
        setIsLoading(false);
        setIsVehicleBOLO(true);
        if (value) setBOLOExpirationDate(dayjs(value).format('DD-MM-YYYY'));
        
        modals.closeAll();
      })}
    >
      <Stack>
        <div style={{ display: 'flex', gap: 10 }}>
          <TextInput
            label={locales.plate}
            disabled={props.plate ? true : false}
            required
            w={'50%'}
            {...form.getInputProps('plate')}
          />

          <DatePickerInput
            w={'50%'}
            icon={<IconCalendar size={18} />}
            label={locales.bolo_expiration_date}
            placeholder="2023-03-12"
            weekendDays={[]}
            required
            minDate={new Date()}
            popoverProps={{ withinPortal: true }}
            value={value}
            onChange={setValue}
          />
        </div>
        <Textarea
          label={locales.reason}
          required
          minRows={3}
          {...form.getInputProps('reason')}
        />
        <Button variant="light" color='gray' type="submit" loading={isLoading}>
          Create
        </Button>
      </Stack>
    </form>
  );
};

export default CreateBoloModal;