import React, { useState } from 'react';
import { RosterOfficer } from '../../../../../../typings';
import { Button, Checkbox, Stack } from '@mantine/core';
import { fetchNui } from '../../../../../../utils/fetchNui';
import { modals } from '@mantine/modals';
import useRosterStore from '../../../../../../stores/roster/roster';
import locales from '../../../../../../locales';

interface Props {
  officer: RosterOfficer;
}

const SetRolesModal: React.FC<Props> = ({ officer }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setRosterOfficers } = useRosterStore();
  const [apu, setAPU] = useState(officer.apu || false);
  const [air, setAIR] = useState(officer.air || false);
  const [mc, setMC] = useState(officer.mc || false);
  const [k9, setK9] = useState(officer.k9 || false);
  const [fto, setFTO] = useState(officer.fto || false);

  const ConfirmHandling = async () => {
    setIsLoading(true);
    await fetchNui<boolean>(
      'setOfficerRoles',
      { citizenid: officer.citizenid, roles: { apu: apu, air: air, mc: mc, k9: k9, fto: fto } },
      { data: true, delay: 500 }
    );
    setIsLoading(false);
    setRosterOfficers((prev) =>
      prev.map((record) =>
        record.citizenid === officer.citizenid ? { ...officer, apu: apu, air: air, mc: mc, k9: k9, fto: fto } : record
      )
    );
    modals.closeAll();
  }

  return (
    <Stack>
      <div
        style={{
          display: 'flex',
          gap: 15,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Checkbox label={locales.apu} checked={apu} onChange={() => {setAPU(!apu)}} />
        <Checkbox label={locales.air} checked={air} onChange={() => {setAIR(!air)}} />
        <Checkbox label={locales.mc} checked={mc} onChange={() => {setMC(!mc)}} />
        <Checkbox label={locales.k9} checked={k9} onChange={() => {setK9(!k9)}} />
        <Checkbox label={locales.fto} checked={fto} onChange={() => {setFTO(!fto)}} />
      </div>
      <Button type="submit" color='gray' loading={isLoading} variant="light" onClick={ConfirmHandling}>
        {locales.confirm}
      </Button>
    </Stack>
  );
};

export default SetRolesModal;