import React, { useMemo } from 'react';
import CallCard from './CallCard';
import { ScrollArea } from '@mantine/core';
import '../../index.css';
import { useCalls, useCallsStore } from '../../../../../../stores/dispatch/calls';
import { Call, UnitsObject } from '../../../../../../typings';
import { convertUnitsToArray } from '../../../../../../helpers';
import { useNuiEvent } from '../../../../../../hooks/useNuiEvent';


const CallsList = () => {
  const calls = useCalls();
  const { updateCallUnits, setCalls } = useCallsStore();

  useNuiEvent('setCallUnits', (data: { id: number; units: UnitsObject }) => {
    const unitsArray = convertUnitsToArray(data.units);
    updateCallUnits(data.id, unitsArray);
  });

  useNuiEvent('updateCalls', (data: { calls: Call[] }) => {
    setCalls(data.calls);
  });

  const sortedCalls = useMemo(() => {
    return calls.sort((a, b) => b.id - a.id);
  }, [calls]);

  return (
    <ScrollArea h={850} scrollbarSize={6}>
      <div className='calls-list'>
        {sortedCalls.map((call) => (
          <CallCard key={call.id} call={call} />
        ))}
      </div>
    </ScrollArea>
  )
}

export default CallsList