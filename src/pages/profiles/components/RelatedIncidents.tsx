import { Group, Paper, Text, createStyles, Divider, ScrollArea, Menu, Stack, UnstyledButton } from '@mantine/core'
import { IconChevronRight, IconListDetails } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { IncidentData, ProfileData } from '../../../typings';
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

const RelatedIncidents = () => {
  const { classes } = useStyles();
  const { incidents } = useStoreIncidents();
  const { selectedProfile } = useStoreProfiles();
  const [relatedIncidents, setRelatedIncidents] = useState<IncidentData[]>([]);

  function findIncidentsByCitizenId(citizenId: string | undefined) {
    if (!citizenId) return setRelatedIncidents([]);
    const incidentsByCitizen: IncidentData[] = [];
    incidents.forEach((incident) => {
      const foundInCriminals = incident.involvedCriminals.some((criminal) => criminal.citizenid === citizenId);
      if (foundInCriminals) {
        incidentsByCitizen.push(incident);
      }
    });
    setRelatedIncidents(incidentsByCitizen);
  }

  useEffect(() => {
    findIncidentsByCitizenId(selectedProfile?.citizenid)
  }, [selectedProfile]);

  return (
		<Paper p='md' withBorder style={{ width: 539, height: 368, backgroundColor: 'rgb(34, 35, 37)' }}>
			<Group position='apart'>
				<Text weight={500}>Known Convictions</Text>
			</Group>

			<Divider my='sm' />

			<ScrollArea h={300}>
				<Stack spacing='xs'>
					{relatedIncidents.map((incident) => (
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
	);
}

export default RelatedIncidents