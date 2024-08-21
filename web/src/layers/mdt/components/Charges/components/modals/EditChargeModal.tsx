import { Button, NumberInput, Stack } from '@mantine/core';
import React, { useState } from 'react';
import { Charge } from '../../../../../../typings';
import { fetchNui } from '../../../../../../utils/fetchNui';
import { modals } from '@mantine/modals';
import { useChargeStore, usePersonalDataStore } from '../../../../../../stores';
import { ChargesObject } from '../../../../../../stores/chargesStore';
import locales from '../../../../../../locales';

interface Props {
  charge: Charge;
}

const EditChargeModal: React.FC<Props> = ({ charge }) => {
  const { setCharges } = useChargeStore();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [chargeFine, setChargeFine] = useState<number | ''>(charge.fine);
  const [chargeTime, setChargeTime] = useState<number | ''>(charge.time);
  const [chargePoints, setChargePoints] = useState<number | ''>(charge.points);
  const personalRole = usePersonalDataStore(state => state.personalData.role);

  function checkPermissionForRole(personalRole: string): boolean {
    if (personalRole === 'Chief' || personalRole === 'Assistant Chief' || personalRole === 'Captain' || personalRole === 'Lieutenant' || personalRole === 'Sergeant') {
      return false;
    } else {
      return true;
    }
  }

  const handleConfirm = async () => {
    setConfirmLoading(true);
    const resp = await fetchNui<boolean>(
      'editCharge',
      { chargelabel: charge.label, fine: chargeFine, time: chargeTime, points: chargePoints },
      { data: true }
    );
    if (!resp) return;
    setConfirmLoading(false);
    setCharges((prevCharges) => {
      const newCharges: ChargesObject = { ...prevCharges };
      Object.keys(prevCharges).forEach((category) => {
        newCharges[category] = prevCharges[category].map(c =>
          c.label === charge.label ? { ...charge, fine: Number(chargeFine), time: Number(chargeTime), points: Number(chargePoints) } : c
        );
      });
      return newCharges;
    });
    modals.closeAll();
  };

  return (
    <Stack>
      <NumberInput
        withAsterisk
        label={locales.charge_fine}
        value={chargeFine}
        onChange={setChargeFine}
        min={0}
        variant="filled"
        placeholder={locales.charge_fine}
        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
        formatter={(value) =>
          !Number.isNaN(parseFloat(value))
            ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
            : '$ '
        }
        disabled={checkPermissionForRole(personalRole)}
      />

      <NumberInput
        label={locales.charge_jailtime}
        value={chargeTime}
        onChange={setChargeTime}
        min={0}
        placeholder={locales.charge_jailtime}
        variant='filled'
        disabled={checkPermissionForRole(personalRole)}
      />

      <NumberInput
        label={locales.charge_points}
        value={chargePoints}
        onChange={setChargePoints}
        min={0}
        placeholder={locales.charge_points}
        variant='filled'
        disabled={checkPermissionForRole(personalRole)}
      />
      <Button variant="light" color='gray' onClick={handleConfirm} loading={confirmLoading}>
        {locales.confirm}
      </Button>
    </Stack>
  );
};

export default EditChargeModal;