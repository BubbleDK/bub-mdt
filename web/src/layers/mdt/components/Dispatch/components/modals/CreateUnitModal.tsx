import React from 'react';
import { Button, Select, Stack } from '@mantine/core';
import { IconCar } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { UnitType } from '../../../../../../typings';
import { fetchNui } from '../../../../../../utils/fetchNui';
import { usePersonalDataStore } from '../../../../../../stores';
import locales from '../../../../../../locales';

const CreateUnitModal: React.FC = () => {
  const { setPersonalData } = usePersonalDataStore();
  const [value, setValue] = React.useState<UnitType>('car');

  const handleConfirm = async () => {
    modals.closeAll();
    const resp = await fetchNui<{ id: number; name: string }>('createUnit', value, {
      data: { id: 1, name: `Unit 1` },
    });
    setPersonalData((prev) => ({ ...prev, unit: resp.id }));
  };

  return (
    <Stack>
      <Select
        value={value}
        onChange={(val: UnitType) => setValue(val)}
        label={locales.unit_vehicle_type}
        withinPortal
        icon={<IconCar size={20} />}
        defaultValue="car"
        data={[
          { label: "Car", value: 'car' },
          { label: 'Boat', value: 'boat' },
          { label: "Heli", value: 'heli' },
          { label: 'Motor', value: 'motor' },
        ]}
      />
      <Button color="gray" variant="light" onClick={handleConfirm}>
        {locales.confirm}
      </Button>
    </Stack>
  );
};

export default CreateUnitModal;