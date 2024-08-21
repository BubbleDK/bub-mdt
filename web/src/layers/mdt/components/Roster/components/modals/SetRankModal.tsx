import { Button, Select, Stack } from '@mantine/core';
import React, { useState } from 'react';
import { RosterOfficer } from '../../../../../../typings';
import { fetchNui } from '../../../../../../utils/fetchNui';
import { modals } from '@mantine/modals';
import useRosterStore from '../../../../../../stores/roster/roster';
import locales from '../../../../../../locales';

interface Props {
  officer: RosterOfficer;
}

const SetRankModal: React.FC<Props> = ({ officer }) => {
  const data = ['Cadet', 'Probationary Trooper', 'Trooper', 'Senior Trooper', 'Master Trooper', 'Corporal', 'Sergeant', 'Lieutenant', 'Captain', 'Assistant Chief', 'Chief']
  const [rank, setRank] = useState<number | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { setRosterOfficers } = useRosterStore();

  const handleConfirm = async () => {
    if (rank === null) return;
    setConfirmLoading(true);
    const resp = await fetchNui<boolean>(
      'setOfficerRank',
      { citizenId: officer.citizenid, grade: +rank },
      { data: true }
    );
    if (!resp) return;
    setRosterOfficers((prev) =>
      prev.map((record) =>
        record.citizenid === officer.citizenid
          ? { ...officer, title: `${data[rank]}` }
          : record
      )
    );
    setConfirmLoading(false);
    modals.closeAll();
  };

  return (
    <Stack>
      <Select
        withinPortal
        value={rank !== null ? rank.toString() : null}
        data={data ? data.map((rank, index) => ({ label: rank, value: index.toString() })) : []}
        onChange={(value) => setRank(value !== null ? +value : null)}
        label={locales.rank}
      />
      <Button variant="light" color='gray' onClick={handleConfirm} loading={confirmLoading}>
        {locales.confirm}
      </Button>
    </Stack>
  );
};

export default SetRankModal;