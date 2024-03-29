import { Paper, Group, ActionIcon, Divider, Text, Tooltip, createStyles, ScrollArea, Menu, Stack, UnstyledButton } from '@mantine/core'
import { IconChevronRight, IconDeviceFloppy, IconLinkOff, IconListDetails } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { IncidentData } from '../../../typings';
import { useStoreIncidents } from '../../../store/incidentsStore';
import { useStoreProfiles } from '../../../store/profilesStore';

const useStyles = createStyles((theme) => ({
	action: {
		backgroundColor: theme.colors.dark[2],
		...theme.fn.hover({
			backgroundColor:
				theme.colorScheme === "dark"
					? theme.colors.dark[5]
					: theme.colors.gray[1],
		}),
	},

  user: {
    display: 'block',
    width: '100%',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
  },

  item : {
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingRight: '10px',
    paddingLeft: '10px',
    backgroundColor: '#1d1e20',

    '&:hover': {
      backgroundColor: '#17181b',
    },
  }
}));

const InvolvedIncidents = () => {
  const { classes } = useStyles();
  const { incidents } = useStoreIncidents();
  const { selectedProfile } = useStoreProfiles();
  const [involvedIncidents, setInvolvedIncidents] = useState<IncidentData[]>([]);

  function findInvolvedIncidentsByCitizenId(citizenId: string | undefined) {
    if (!citizenId) return setInvolvedIncidents([]);
    const InvolvedCivilians: IncidentData[] = [];
    incidents.forEach((incident) => {
      const foundInInvolvedCivilians = incident.involvedCivilians.some((civilian) => civilian.citizenid === citizenId);
      if (foundInInvolvedCivilians) {
        InvolvedCivilians.push(incident);
      }
    });
    setInvolvedIncidents(InvolvedCivilians);
  }

  useEffect(() => {
    findInvolvedIncidentsByCitizenId(selectedProfile?.citizenid)
  }, [selectedProfile])

  return (
    <Paper p='md' withBorder style={{ width: 540, height: 368, backgroundColor: 'rgb(34, 35, 37)' }}>
      <Group position='apart'>
				<Text weight={500}>Involved Incidents</Text>
			</Group>

      <Divider my='sm' />

      <ScrollArea h={300}>
				<Stack spacing='xs'>
					{involvedIncidents.map((incident) => (
						<UnstyledButton className={classes.user} key={incident.id}>
							<Menu withArrow>
								<Menu.Target>
									<Group className={classes.item}>
										<div style={{ flex: 1 }}>
											<Text size='sm' weight={500}>
												{incident.title}
											</Text>

											<Text color='dimmed' size='xs'>
												ID: {incident.id}
											</Text>
										</div>

										{<IconChevronRight size={14} stroke={1.5} />}
									</Group>
								</Menu.Target>
								<Menu.Dropdown>
									<Menu.Item icon={<IconListDetails size={14} />}>
										View Incident
									</Menu.Item>
								</Menu.Dropdown>
							</Menu>
						</UnstyledButton>
					))}
				</Stack>
			</ScrollArea>
    </Paper>
  )
}

export default InvolvedIncidents