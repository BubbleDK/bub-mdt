import React from 'react';
import { ActionIcon, Button, Drawer, Select, Stack, Tooltip } from '@mantine/core';
import { IconTools } from '@tabler/icons-react';
import { debugData } from '../../utils/debugData';
import { Call } from '../../typings';
import { useAppVisibilityStore } from '../../stores';

const setBackground = (bg: string) => {
  const root = document.getElementById('root');

  // https://i.imgur.com/iPTAdYV.png - Night time img
  // https://i.imgur.com/3pzRj9n.png - Day time
  root!.style.backgroundImage = `url(${bg})`;
  root!.style.backgroundSize = 'cover';
  root!.style.backgroundRepeat = 'no-repeat';
  root!.style.backgroundPosition = 'center';
};

const Dev: React.FC = () => {
  const [opened, setOpened] = React.useState(false);
  const toggleVisibility = useAppVisibilityStore((state) => state.toggle);

  return (
    <>
      <Tooltip label="Developer drawer" position="bottom">
        <ActionIcon
          onClick={() => setOpened(true)}
          radius="xl"
          variant="filled"
          color="orange"
          sx={{ position: 'absolute', bottom: 0, right: 0, width: 50, height: 50 }}
          size="xl"
          mr={50}
          mb={50}
        >
          <IconTools />
        </ActionIcon>
      </Tooltip>

      <Drawer
        position="left"
        onClose={() => setOpened(false)}
        opened={opened}
        title="Developer drawer"
        padding="xl"
        size="xs"
        zIndex={1}
      >
        <Stack>
          <Select
            onChange={(val) => setBackground(val as string)}
            defaultValue="https://i.imgur.com/3pzRj9n.png"
            data={[
              { label: 'Day', value: 'https://i.imgur.com/3pzRj9n.png' },
              { label: 'Night', value: 'https://i.imgur.com/iPTAdYV.png' },
            ]}
            label="Background"
          />
          <Button onClick={() => toggleVisibility()}>Toggle MDT</Button>
          <Button
            onClick={() =>
              debugData<Call>([
                {
                  action: 'addCall',
                  data: {
                    id: 4,
                    offense: 'Vehicle theft',
                    code: '10-15',
                    blip: 51,
                    coords: [1, 1],
                    linked: false,
                    time: Date.now(),
                    location: 'Strawberry Ave',
                    info: [
                      { label: 'Sultan RS', icon: 'car' },
                      { label: 'XYZ 123', icon: 'badge-tm' },
                    ],
                    units: [],
                  },
                },
              ])
            }
          >
            Add call
          </Button>
        </Stack>
      </Drawer>
    </>
  );
};

export default Dev;