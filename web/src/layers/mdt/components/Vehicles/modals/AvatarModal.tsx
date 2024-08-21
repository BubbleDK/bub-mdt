import React, { useRef, useState } from 'react';
import { Button, Stack, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import { fetchNui } from '../../../../../utils/fetchNui';
import locales from '../../../../../locales';
import useVehiclesStore from '../../../../../stores/vehicles/vehicles';

interface Props {
  image?: string;
}

const AvatarModal: React.FC<Props> = (props) => {
  const { setSelectedVehicle, selectedVehicle } = useVehiclesStore();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedVehicle) return;
    setIsLoading(true);
    const image = inputRef.current?.value;
    await fetchNui('updateVehicleImage', { plate: selectedVehicle.plate, image: image }, { data: 1 });
    setSelectedVehicle({ ...selectedVehicle, image });
    modals.closeAll();
  };

  return (
    <Stack>
      <TextInput
        defaultValue={props.image}
        ref={inputRef}
        label={locales.image}
        description={locales.avatar_description_vehicle}
        placeholder="https://r2.fivemanage.com/placeholder.jpg"
      />
      <Button variant="light" color="gray" onClick={handleConfirm} loading={isLoading}>
        {locales.confirm}
      </Button>
    </Stack>
  );
};

export default AvatarModal;