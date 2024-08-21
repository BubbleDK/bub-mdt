import React, { useEffect } from 'react';
import { Stack } from '@mantine/core';
import UnitCard from './UnitCard';
import { useNuiEvent } from '../../../../../../hooks/useNuiEvent';
import { Unit } from '../../../../../../typings';
import { convertUnitsToArray } from '../../../../../../helpers';
import useUnitStore from '../../../../../../stores/dispatch/units';
import { usePersonalDataStore } from '../../../../../../stores';

const UnitsList: React.FC = () => {
  const { units, fetchUnits, setUnits } = useUnitStore();
  const { personalData } = usePersonalDataStore();

  useNuiEvent('refreshUnits', (data: { [key: string]: Omit<Unit, 'id'> }) => {
    const units = convertUnitsToArray(data);
    setUnits(units);
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  return (
    <Stack>
      {units.length > 0 && (
        units.map((unit) => (
          <UnitCard
            key={`${unit.id}-${unit.members}`}
            unit={unit}
            isInThisUnit={personalData.unit === unit.id}
          />
        ))
      )}
    </Stack>
  );
};

export default UnitsList;