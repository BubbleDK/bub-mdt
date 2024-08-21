import { ActionIcon, Avatar, Checkbox, Group, Input, Menu, ScrollArea, Table, Text } from '@mantine/core'
import React from 'react'
import { Icon123, IconArrowBadgeUp, IconBadges, IconListDetails, IconSettings, IconUserX } from '@tabler/icons-react';
import { RosterOfficer } from '../../../../../typings';
import dayjs from 'dayjs';
import { modals } from '@mantine/modals';
import { fetchNui } from '../../../../../utils/fetchNui';
import useRosterStore from '../../../../../stores/roster/roster';
import SetCallSignModal from './modals/SetCallSignModal';
import SetRankModal from './modals/SetRankModal';
import SetRolesModal from './modals/SetRolesModal';
import locales from '../../../../../locales';

const RosterTable = ({officers, hasPermission}: {officers: RosterOfficer[], hasPermission: boolean}) => {
  const { setRosterOfficers } = useRosterStore();

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const getTimeAgoText = (timeAgo: number) => {
    const now = dayjs();
    const dateToCompare = dayjs(timeAgo);
    const diffDays = now.diff(dateToCompare, 'day');
  
    if (diffDays === 0) {
      return capitalize(locales.today);
    } else if (diffDays === 1) {
      return capitalize(locales.yesterday);
    } else {
      return capitalize(dayjs(timeAgo).fromNow());
    }
  }

  const rosterRow = officers.map((officer) => (
    <tr key={officer.citizenid}>
      <td>
        <Group spacing="sm">
          <Avatar size={55} src={officer.image} radius={5} />
          <div>
            <Text fz="sm" fw={500}>
              {officer.firstname} {officer.lastname}
            </Text>
          </div>
        </Group>
      </td>

      <td>{officer.callsign}</td>

      <td>
        <Checkbox 
          checked={officer.apu} 
          disabled 
          styles={{ 
            input: { 
              '&:disabled ': {
                backgroundColor: officer.apu ? '#1971c2' : '#373A40',
              },
            },
          }} 
        />
      </td>
      <td>
        <Checkbox 
          checked={officer.air} 
          disabled 
          styles={{ 
            input: { 
              '&:disabled ': {
                backgroundColor: officer.air ? '#1971c2' : '#373A40',
              },
            },
          }} 
        />
      </td>
      <td>
        <Checkbox 
          checked={officer.mc} 
          disabled 
          styles={{ 
            input: { 
              '&:disabled ': {
                backgroundColor: officer.mc ? '#1971c2' : '#373A40',
              },
            },
          }} 
        />
      </td>
      <td>
        <Checkbox 
          checked={officer.k9} 
          disabled 
          styles={{ 
            input: { 
              '&:disabled ': {
                backgroundColor: officer.k9 ? '#1971c2' : '#373A40',
              },
            },
          }} 
        />
      </td>
      <td>
        <Checkbox 
          checked={officer.fto} 
          disabled 
          styles={{ 
            input: { 
              '&:disabled ': {
                backgroundColor: officer.fto ? '#1971c2' : '#373A40',
              },
            },
          }} 
        />
      </td>


      <td>{officer.lastActive ? getTimeAgoText(officer.lastActive) : ''}</td>

      <td>
        <Input
          disabled
          icon={<IconBadges size={16} />}
          variant="unstyled"
          placeholder={officer.title}
          size='xs'
        />
      </td>

      <td>
        <Group spacing={2} position="right">
          <Menu withinPortal withArrow position="bottom-end">
            <Menu.Target>
              <ActionIcon>
                <IconSettings size="1.2rem" stroke={1.5} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                icon={<Icon123 size={20} />}
                onClick={() =>
                  modals.open({
                    title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.set_callsign}</Text>,
                    children: <SetCallSignModal officer={officer} />,
                    size: 'xs',
                    centered: true,
                  })
                }
              >
                {locales.set_callsign}
              </Menu.Item>
              <Menu.Item
                disabled={hasPermission}
                icon={<IconArrowBadgeUp size={20} />}
                onClick={() =>
                  modals.open({ 
                    title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.set_rank}</Text>, 
                    centered: true, 
                    size: 'xs', 
                    children: <SetRankModal officer={officer} /> 
                  })
                }
              >
                {locales.set_rank}
              </Menu.Item>
              <Menu.Item
                disabled={hasPermission}
                icon={<IconListDetails size={20} />}
                onClick={() =>
                  modals.open({ 
                    title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.set_roles}</Text>, 
                    centered: true, 
                    size: 'sm', 
                    children: <SetRolesModal officer={officer} /> 
                  })
                }
              >
                {locales.set_roles}
              </Menu.Item>
              <Menu.Item
                icon={<IconUserX size={20} />}
                color="red"
                disabled={hasPermission}
                onClick={() =>
                  modals.openConfirmModal({
                    title: <Text style={{ fontSize: 17, color: "white" }} weight={500}>{locales.fire_officer}</Text>,
                    children: (
                      <Text c="dark.2" size="sm">
                        {locales.fire_officer_description.format(officer.firstname, officer.lastname)}
                      </Text>
                    ),
                    labels: { confirm: locales.confirm, cancel: locales.cancel },
                    centered: true,
                    groupProps: {
                      spacing: 6,
                    },
                    confirmProps: {
                      color: 'red',
                    },
                    onConfirm: async () => {
                      const resp = await fetchNui('fireOfficer', officer.citizenid, { data: true });
                      if (!resp) return;
                      setRosterOfficers((prev) => prev.filter((record) => record.citizenid !== officer.citizenid));
                      modals.closeAll();
                    },
                  })
                }
              >
                {locales.fire_officer}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </td>
    </tr>
  ));

  return (
    <ScrollArea h={735}>
      <Table verticalSpacing="sm">
        <thead>
          <tr>
            <th>{locales.officer}</th>
            <th>{locales.callsign}</th>
            <th>{locales.apu}</th>
            <th>{locales.air}</th>
            <th>{locales.mc}</th>
            <th>{locales.k9}</th>
            <th>{locales.fto}</th>
            <th>{locales.last_active}</th>
            <th>{locales.role}</th>
            <th />
          </tr>
        </thead>
        <tbody>{rosterRow}</tbody>
      </Table>
    </ScrollArea>
  )
}

export default RosterTable;
