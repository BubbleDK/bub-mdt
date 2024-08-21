import React, { useEffect, useState } from 'react';
import { Call } from '../../../typings';
import { Badge, createStyles, Divider, Group, SimpleGrid, Stack, Text, Transition } from '@mantine/core';
import { IconClock, IconMap2 } from '@tabler/icons-react';
import dayjs from 'dayjs';
import NotificationInfo from './NotificationInfo';
import { useTimeout } from '@mantine/hooks';
import UnitBadge from '../../mdt/components/UnitBadge';

interface Props {
  call: Call;
  setQueue: React.Dispatch<React.SetStateAction<Call[]>>;
}

const useStyles = createStyles((theme) => ({
  notification: {
    width: '100%',
    height: 'fit-content',
    backgroundColor: '#242527',
    color: '#d5d5d5',
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    opacity: 1,
    boxShadow: theme.shadows.md,
    zIndex: 0,
    borderLeft: '3px solid rgb(25, 113, 194)',
  },
}));

const DispatchNotification: React.FC<Props> = ({ call, setQueue }) => {
  const { classes } = useStyles();
  const [mounted, setMounted] = useState(false);
  const timeout = useTimeout(() => setMounted(false), call.isEmergency ? 13000 : 10000, {
    autoInvoke: true,
  });

  useEffect(() => {
    setMounted(true);
    return () => timeout.clear();
  }, []);

  return (
    <Transition
      mounted={mounted}
      transition="slide-left"
      onExited={() => setQueue((prev) => prev.filter((prevCall) => prevCall.id !== call.id))}
    >
      {(style) => (
        <Stack className={classes.notification} spacing={6} style={style}>
          <Group position="apart">
            <Group spacing="xs">
              <Badge variant="light" radius="xs">
                #{call.id + 1}
              </Badge>
              <Text>{call.offense}</Text>
            </Group>
            <Badge variant="light" color={call.isEmergency ? 'red' : 'blue'} radius="xs">
              {call.code}
            </Badge>
          </Group>
          <Divider />
          <SimpleGrid cols={2} spacing={3}>
            <NotificationInfo label={dayjs(call.time).fromNow() === 'a few seconds ago' ? 'Just now' : dayjs(call.time).fromNow()} icon={IconClock} />
            <NotificationInfo icon={IconMap2} label={call.location} />
            {call.info &&
              call.info.length > 0 &&
              call.info.map((info) => <NotificationInfo key={info.label} icon={info.icon} label={info.label} />)}
          </SimpleGrid>
          {call.units.length > 0 && (
            <>
              <Divider label={`Responding units ${call.units.length}`} labelPosition="center" />
              <Group spacing="xs">
                {call.units.map((unit) => (
                  <UnitBadge unit={unit} key={unit.id} />
                ))}
              </Group>
            </>
          )}
        </Stack>
      )}
    </Transition>
  );
};

export default React.memo(DispatchNotification);