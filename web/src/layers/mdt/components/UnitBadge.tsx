import React from 'react';
import { Badge, Stack } from '@mantine/core';
import { IconCar, IconHelicopter, IconMotorbike, IconSpeedboat } from '@tabler/icons-react';
import { Unit } from '../../../typings';

interface Props {
  unit: Unit;
}

const UnitBadge: React.FC<Props> = ({ unit }) => {
  return (
    <Badge
      leftSection={
        <Stack>
          {unit.type === 'car' ? (
            <IconCar size={18} />
          ) : unit.type === 'motor' ? (
            <IconMotorbike size={18} />
          ) : unit.type === 'boat' ? (
            <IconSpeedboat size={18} />
          ) : (
            <IconHelicopter size={18} />
          )}
        </Stack>
      }
    >
      {unit.name}
    </Badge>
  );
};

export default UnitBadge;