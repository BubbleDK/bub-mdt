import { Stack, Button } from '@mantine/core'
import React, { useState } from 'react'
import TextEditor from '../../../TextEditor';
import { modals } from '@mantine/modals';
import useAnnouncementStore from '../../../../../../stores/announcementStore';
import { isEnvBrowser } from '../../../../../../utils/misc';
import { fetchNui } from '../../../../../../utils/fetchNui';
import locales from '../../../../../../locales';

const CreateAnnouncementModal = () => {
  const { fetchAnnouncements } = useAnnouncementStore(state => ({
    fetchAnnouncements: state.fetchAnnouncements
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');

  const createAnnouncement = async () => {
    if (!isEnvBrowser()) {
      setIsLoading(true);

      const resp = await fetchNui('createAnnouncement', { contents: value });
      if (!resp) return;

      fetchAnnouncements();

      setIsLoading(false);
    }
    modals.closeAll();
  };

  return (
    <Stack h={400} style={{ flex: '0 0 43.5rem' }}>
      <TextEditor 
        content={''}
        onChange={(value) => setValue(value || '')}
        styles={{ content: { backgroundColor: '#1A1B1E' }, toolbar: { backgroundColor: '#2C2E33' }, controlsGroup: { pointerEvents: 'auto', backgroundColor: '#282828' }}}
        contentAreaStyle={{ height: 270, width: 406, padding: 0 }}
      />
      <Button
        variant="light"
        color='gray'
        fullWidth
        onClick={() => (createAnnouncement())}
        loading={isLoading}
      >
        {locales.create}
      </Button>
    </Stack>
  )
}

export default CreateAnnouncementModal;