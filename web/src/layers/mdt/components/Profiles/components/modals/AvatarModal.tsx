import React, { useRef, useState } from 'react';
import { Button, Stack, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import { fetchNui } from '../../../../../../utils/fetchNui';
import locales from '../../../../../../locales';
import { useProfilesStore } from '../../../../../../stores';

interface Props {
  image?: string;
}

const AvatarModal: React.FC<Props> = (props) => {
  const { setSelectedProfile, selectedProfile } = useProfilesStore();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedProfile) return;
    setIsLoading(true);
    const image = inputRef.current?.value;
    await fetchNui('updateProfileImage', { citizenId: selectedProfile.citizenid, image: image }, { data: 1 });
    setSelectedProfile({ ...selectedProfile, image });
    modals.closeAll();
  };

  return (
    <Stack>
      <TextInput
        defaultValue={props.image}
        ref={inputRef}
        label={locales.image}
        description={locales.avatar_description}
        placeholder="https://r2.fivemanage.com/placeholder.jpg"
      />
      <Button variant="light" color="gray" onClick={handleConfirm} loading={isLoading}>
        Confirm
      </Button>
    </Stack>
  );
};

export default AvatarModal;