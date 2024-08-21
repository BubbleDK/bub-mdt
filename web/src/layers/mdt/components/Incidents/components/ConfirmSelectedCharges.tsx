import React, { useState } from 'react';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { Criminal, SelectedCharge } from '../../../../../typings';
import useSelectedChargesStore from '../../../../../stores/incidents/editCharges';
import useIncidentStore from '../../../../../stores/incidents/incident';
import { fetchNui } from '../../../../../utils/fetchNui';
import locales from '../../../../../locales';

interface Props {
  criminal: Criminal;
}

const calculateCharges = (charges: SelectedCharge[]) => {
  const penalty: Criminal['penalty'] = {
    reduction: null,
    fine: 0,
    time: 0,
    points: 0,
  };

  for (let i = 0; i < charges.length; i++) {
    const charge = charges[i];
    penalty.time += charge.time * charge.count;
    penalty.fine += charge.fine * charge.count;
    penalty.points += charge.points * charge.count
  }

  return penalty;
};

const ConfirmSelectedCharges: React.FC<Props> = ({ criminal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedCharges, setSelectedCharges } = useSelectedChargesStore();
  const { setCriminal } = useIncidentStore();

  return (
    <Button
      variant="light" 
      color="gray"
      loading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        const resp = await fetchNui('getRecommendedWarrantExpiry', selectedCharges, { data: Date.now() });
        setCriminal(criminal.citizenid, (prev) => ({
          ...prev,
          charges: selectedCharges,
          penalty: calculateCharges(selectedCharges),
          warrantExpiry: new Date(resp),
        }));
        setIsLoading(false);
        setSelectedCharges([]);
        modals.closeAll();
      }}
    >
      {locales.confirm}
    </Button>
  );
};

export default ConfirmSelectedCharges;