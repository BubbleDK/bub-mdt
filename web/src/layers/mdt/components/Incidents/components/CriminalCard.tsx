import React from 'react'
import { ActionIcon, Badge, Checkbox, Divider, Group, Select, Text, Tooltip } from '@mantine/core';
import { IconCalendar, IconClockDown, IconDeviceFloppy, IconTrash, IconUserShare } from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { useNavigate } from 'react-router-dom';
import { modals } from '@mantine/modals';
import EditChargesModal from './modals/EditChargesModal';
import dayjs from 'dayjs';
import { Criminal, Profile } from '../../../../../typings';
import { formatNumber } from '../../../../../utils/formatNumber';
import useIncidentStore from '../../../../../stores/incidents/incident';
import useSelectedChargesStore from '../../../../../stores/incidents/editCharges';
import { useProfilesStore } from '../../../../../stores';
import { fetchNui } from '../../../../../utils/fetchNui';
import { isEnvBrowser } from '../../../../../utils/misc';
import locales from '../../../../../locales';

interface Props {
  criminal: Criminal;
}

const percentages = [25, 50, 75, 80, 90];

const calculatePenalty = (value: number, percent: number | null) => {
  if (!percent) return value;
  return Math.round(value - (percent / 100) * value);
};

const calculateReductions = (penalties: Criminal['penalty']) => {
  const reductions: Array<{ label: string; value: string }> = [];
  if (!penalties) return [];

  for (let i = 0; i < percentages.length; i++) {
    const percent = percentages[i];
    const time = calculatePenalty(penalties.time, percent);
    const fine = calculatePenalty(penalties.fine, percent);

    reductions[i] = {
      label: `${percent}% (${time} ${locales.months} / ${formatNumber(fine)})`,
      value: percent.toString(),
    };
  }

  return reductions;
};

const CriminalCard = ({ criminal }: Props) => {
  const { incident, setCriminals, setCriminal } = useIncidentStore();
  const { setSelectedCharges } = useSelectedChargesStore();
  const { setSelectedProfile } = useProfilesStore();

  const navigate = useNavigate();

  return (
    <div className='incident-criminal-card-background'>
      <div className='incident-criminal-card-header'>
        <Text style={{ fontSize: 15, color: 'white' }} weight={600}>
          {criminal.firstname} {criminal.lastname}
        </Text>

        <div className='incident-criminal-card-buttons'>
          <Tooltip label={locales.remove_criminal} withArrow color='gray' position='bottom'>
            <ActionIcon variant="light" color="red" onClick={() => { 
              modals.openConfirmModal({
                title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.remove_criminal}</Text>,
                size: 'sm',
                centered: true,
                labels: { confirm: locales.confirm, cancel: locales.cancel },
                groupProps: {
                  spacing: 6,
                },
                confirmProps: { color: 'red' },
                onConfirm: async () => {
                  const success = await fetchNui(
                    'removeCriminal',
                    { id: incident.id, criminalId: criminal.citizenid },
                    { data: 1 }
                  );

                  if (success) setCriminals((prev) => prev.filter((crim) => crim.citizenid !== criminal.citizenid));
                },
                children: (
                  <Text size="sm" c="dark.2">
                    {locales.remove_criminal_confirm.format(criminal.firstname, criminal.lastname)}
                  </Text>
                ),
              })
            }}>
              <IconTrash size={16} color={'white'} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label={locales.go_to_profile} withArrow color='gray' position='bottom'>
            <ActionIcon variant="light" color="dark" onClick={async () => { 
              if (!isEnvBrowser()) {
                const resp = await fetchNui<Profile>('getProfile', criminal.citizenid);
                setSelectedProfile(resp);
              }
              navigate('/profiles'); 
            }}>
              <IconUserShare size={16} color={'white'} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label={locales.save_criminal} withArrow color='gray' position='bottom'>
            <ActionIcon variant="light" color="dark" onClick={() => { 
              fetchNui(
                'saveCriminal',
                {
                  id: incident.id,
                  criminal: {
                    ...criminal,
                    warrantExpiry: criminal.warrantExpiry
                      ? dayjs(criminal.warrantExpiry).format('YYYY-MM-DD HH:mm:ss')
                      : null,
                  },
                },
                { data: 1 }
              );
            }}>
              <IconDeviceFloppy size={16} color={'white'} />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>

      <Text color='dimmed' size='xs'>
        #{criminal.citizenid}
      </Text>

      <div className='incident-criminal-content'>
        <div className='incident-criminal-edit-charges-badges'>
          <Badge 
            radius="xs" 
            variant="light"
            style={{color: 'white', fontSize: 10, padding: 12.5, cursor: 'pointer', backgroundColor: '#343a40'}}
            w={125}
            onClick={() => {
              setSelectedCharges(criminal.charges)
              modals.open({ title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.edit_charges}</Text>, styles: { body: { height: 700, overflow: 'hidden' }, content: { width: 1400 } }, centered: true, size: 1445, children: <EditChargesModal criminal={criminal} /> })
            }}
          >
            {locales.edit_charges}
          </Badge>

          {criminal.charges.map((charge, index) => (
            <Badge 
              radius="xs" 
              variant="filled"
              style={{fontSize: 10, padding: 12.5, fontWeight: 500}}
              color={charge.type.toLowerCase() === 'felony' ? 'red' : (charge.type.toLowerCase() === 'infraction' ? 'green' : 'yellow')}
              key={index}
            >
              {charge.count}x {charge.label}
            </Badge>
          ))}
        </div>

        <Divider style={{ width: '100%' }} />

        <Checkbox
          label={locales.issue_warrant}
          description={locales.issue_warrant_description}
          checked={criminal.issueWarrant}
          onChange={() => setCriminal(criminal.citizenid, (prev) => ({ ...prev, issueWarrant: !prev.issueWarrant }))}
        />

        {criminal.issueWarrant ? (
          <DatePickerInput
            icon={<IconCalendar size={20} />}
            label={locales.warrant_expiration_date}
            placeholder="2023-03-12"
            weekendDays={[]}
            minDate={new Date()}
            value={criminal.warrantExpiry ? new Date(criminal.warrantExpiry) : null}
            onChange={(val) => {
              setCriminal(criminal.citizenid, (prev) => ({ ...prev, warrantExpiry: val }));
            }}
          />
        ) : (
          <>
            <Select
              label={locales.reduction}
              value={criminal.penalty.reduction ? criminal.penalty.reduction.toString() : null}
              data={calculateReductions(criminal.penalty)}
              icon={<IconClockDown size={20} />}
              onChange={(val) =>
                setCriminal(criminal.citizenid, (prev) => ({
                  ...prev,
                  penalty: prev.penalty
                    ? { ...prev.penalty, reduction: val ? +val : null }
                    : { reduction: val ? +val : null, time: 0, fine: 0, points: 0 },
                }))
              }
              clearable
              placeholder={locales.no_reduction}
              variant='filled'
            />
            <Group>
              <Text size="xs" style={{ color: 'white' }}>
                {locales.time}: {calculatePenalty(criminal.penalty.time, criminal.penalty.reduction)} {locales.months}
              </Text>
              <Text size="xs" style={{ color: 'white' }}>
                {locales.fine}: {formatNumber(calculatePenalty(criminal.penalty.fine, criminal.penalty.reduction))}
              </Text>
            </Group>
            <Group>
              <Checkbox
                label={locales.pleaded_guilty}
                checked={criminal.pleadedGuilty}
                onChange={() => setCriminal(criminal.citizenid, (prev) => ({ ...prev, pleadedGuilty: !prev.pleadedGuilty }))}
              />
              <Checkbox
                label={locales.processed}
                checked={criminal.processed}
                onChange={() => setCriminal(criminal.citizenid, (prev) => ({ ...prev, processed: !prev.processed }))}
              />
            </Group>
          </>
        )}
      </div>
    </div>
  )
}

export default CriminalCard;