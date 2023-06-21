import { ActionIcon, Badge, Button, Center, Divider, Group, Paper, Popover, ScrollArea, Select, Text, TextInput, Tooltip, createStyles, rem } from '@mantine/core'
import { IconDeviceFloppy, IconLinkOff, IconPencilPlus, IconLocation, IconPlus, IconX } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { useStoreIncidents } from '../../../store/incidentsStore';
import { IncidentData } from '../../../typings';
import { useForm } from '@mantine/form';
import { useRecentActivityStore } from '../../../store/recentActivity';
import { useStorePersonal } from '../../../store/personalInfoStore';
import { useDisclosure } from '@mantine/hooks';
import TextEditor from '../../../components/TextEditor';

const useStyles = createStyles((theme) => ({
	action: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    }),
  },
  user: {
    display: 'block',
    width: '100%',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
  },

  item : {
    padding: 10,
    backgroundColor: '#1d1e20',
    border: `0.1px solid rgb(42, 42, 42, 1)`,
  },
}));

interface Props {
  handleUnlink: (data: IncidentData | null) => void;
  handleCreateNewIncident: () => void;
  handleSaveIncident: () => void;
}

const IncidentRow = (props: Props) => {
  const { classes, theme } = useStyles();
  const { selectedIncident, createNewIncident } = useStoreIncidents();
  const [openedTagPopover, setOpenedTagPopover] = useState(false);
  const [titleSet, setTitleSet] = useState(true);
  const { addToRecentActivity } = useRecentActivityStore();
  const { firstname, lastname } = useStorePersonal();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [editorContent,setEditorContent] = useState(selectedIncident?.details ? selectedIncident.details : '') 

  const form = useForm({
    initialValues: {
      title: '',
      location: '',
      details: '',
    },
  });

  useEffect(() => {
    if (selectedIncident) {
      form.setValues({
        title: selectedIncident.title,
        location: selectedIncident.location,
      })

      setEditorContent(selectedIncident.details)

    } else {
      form.setValues({
        title: '',
        location: '',
      })

      setEditorContent('')
    }
  }, [selectedIncident]);

  function handleSubmit(): void {
    throw new Error('Function not implemented.');
  }

  function handleCreateClick() {
    if (form.values.title === '') {
      setTitleSet(false);
    } else {
      const newIncidentId = createNewIncident(form.values.title, editorContent, form.values.location);
      form.reset();
      setEditorContent('')
      addToRecentActivity({ category: 'Incidents', type: 'Created', doneBy: firstname + ' ' + lastname, timeAgo: new Date().valueOf(), timeAgotext: '', activityID: newIncidentId.toString() });
      props.handleCreateNewIncident();
    }
  }

  const handleSaveClick = () => {
    addToRecentActivity({ category: 'Incidents', type: 'Updated', doneBy: firstname + ' ' + lastname, timeAgo: new Date().valueOf(), timeAgotext: '', activityID: '3' });
    props.handleSaveIncident();
  }

  return (
    <Paper p='md' withBorder style={{width: 550, backgroundColor: 'rgb(34, 35, 37)'}}>
      <Group position='apart'>
        <Text weight={500} c={'white'}>{selectedIncident ? 'Edit' : 'Create'} Incident {selectedIncident && `(#${selectedIncident.id})`}</Text>
				<Group spacing={8} mr={0}>
          {selectedIncident ? (
            <Tooltip label='Save' withArrow color='dark' position='bottom'>
              <ActionIcon className={classes.action} onClick={() => { handleSaveClick(); }}>
                <IconDeviceFloppy size={16} color={theme.colors.green[6]} />
              </ActionIcon>
            </Tooltip>
          ) : (
            <Tooltip label='Create' withArrow color='dark' position='bottom'>
              <ActionIcon className={classes.action} onClick={() => { handleCreateClick(); }}>
                <IconPencilPlus size={16} color={theme.colors.green[6]} />
              </ActionIcon>
					  </Tooltip>
          )}
					<Tooltip label='Unlink' withArrow color='dark' position='bottom'>
						<ActionIcon className={classes.action} onClick={() => { props.handleUnlink(null); form.reset(); }}>
							<IconLinkOff size={16} color={theme.colors.gray[5]} />
						</ActionIcon>
					</Tooltip>
				</Group>
			</Group>

      <Divider my='sm' />

      <ScrollArea h={800} scrollbarSize={4} type="never">
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          <TextInput radius='xs' variant="filled" placeholder="Place title here..." {...form.getInputProps('title')} error={!titleSet ? 'Fill in a title' : false} />

          <TextEditor 
            key={selectedIncident?.id} 
            onChange={(value) => setEditorContent(value)} 
            initialContent={selectedIncident?.details ? selectedIncident.details : ''} 
            styles={{ content: { backgroundColor: 'rgb(34, 35, 37)' }, toolbar: { backgroundColor: '#252628', zIndex: 999 }}} 
            contentAreaStyle={{ height: 300, width: 510 }}
          />

          <TextInput
            {...form.getInputProps('location')}
            radius='xs' 
            variant="filled"
            rightSection={<Tooltip
              color='dark'
              label="Location of the incident"
              position="top-end"
              withArrow
              transitionProps={{ transition: 'pop-bottom-right' }}
            >
              <Text color="dimmed" sx={{ cursor: 'help' }}>
                <Center>
                  <IconLocation size="1.1rem" stroke={1.5} />
                </Center>
              </Text>
            </Tooltip>}
            placeholder="Location"
          />
        </div>

        <Divider my={10} />

        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          <div className={classes.user}>
            <div className={classes.item}>
              <Group position="apart">
                <Text fz="sm" fw={500} c="white">
                  Involved Evidence
                </Text>

                <Tooltip label='Add Evidence' withArrow color='dark' position="top-end">
                  <ActionIcon className={classes.action} onClick={() => { }}>
                    <IconPlus size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </div>
          </div>

          <div className={classes.user}>
            <div className={classes.item}>
              <Group position="apart">
                <Text fz="sm" fw={500} c="white">
                  Involved Officers
                </Text>

                <Tooltip label='Add Officer' withArrow color='dark' position="top-end">
                  <ActionIcon className={classes.action} onClick={() => { }}>
                    <IconPlus size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>

              <div>
                {selectedIncident?.involvedOfficers.map((officer) => (
                  <Badge 
                    radius="xs" 
                    variant="filled"
                    style={{backgroundColor: 'rgb(42, 42, 42)', marginRight: 5, marginBottom: 5, paddingTop: 10, paddingBottom: 10}}
                    rightSection={
                      <ActionIcon size="xs" radius="xs" variant="transparent">
                        <IconX size={rem(14)} />
                      </ActionIcon>
                    }
                  >
                    ({officer.callsign}) {officer.firstname} {officer.lastname}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className={classes.user}>
            <div className={classes.item}>
              <Group position="apart">
                <Text fz="sm" fw={500} c="white">
                  Involved Citizens
                </Text>

                <Tooltip label='Add Citizen' withArrow color='dark' position="top-end">
                  <ActionIcon className={classes.action} onClick={() => { }}>
                    <IconPlus size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </div>
          </div>
          
          <div className={classes.user}>
            <div className={classes.item}>
              <Group position="apart">
                <Text fz="sm" fw={500} c="white">
                  Involved Vehicles
                </Text>

                <Tooltip label='Add Vehicle' withArrow color='dark' position="top-end">
                  <ActionIcon className={classes.action} onClick={() => { }}>
                    <IconPlus size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </div>
          </div>

          <div className={classes.user}>
            <div className={classes.item}>
              <Group position="apart">
                <Text fz="sm" fw={500} c="white">
                  Tags
                </Text>

                <Popover width={200} position="bottom" withArrow shadow="md" opened={openedTagPopover} onChange={setOpenedTagPopover}>
                  <Popover.Target>
                    <Tooltip label='Add Tag' withArrow color='dark' position="top-end">
                      <ActionIcon className={classes.action} onClick={() => { setOpenedTagPopover((o) => !o) }}>
                        <IconPlus size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Popover.Target>

                  <Popover.Dropdown style={{backgroundColor: 'rgb(34, 35, 37)'}}>
                    <form onSubmit={form.onSubmit((values) => handleSubmit())}>
                      <TextInput radius='xs' label="Tag Name" placeholder="Enter tag name..." />
                      <Select
                        maw={320}
                        mx="auto"
                        mt={5}
                        label="Tag Color"
                        placeholder="Pick one"
                        data={['Blue', 'Red', 'Yellow', 'Orange', 'Green', 'Purple', 'Pink', 'Gray']}
                        transitionProps={{ transition: 'pop-top-left', duration: 80, timingFunction: 'ease' }}
                      />
                      <Group position="right" mt="md">
                        <Button variant="filled" color="green" type="submit" compact>Create</Button>
                      </Group>
                    </form>
                  </Popover.Dropdown>
                </Popover>
              </Group>
              
              <div>
                {selectedIncident?.tags.map((tag) => (
                  <Badge 
                    color={tag.backgroundcolor}
                    radius="xs" 
                    variant="filled"
                    style={{marginRight: 5, marginBottom: 5,}}
                    rightSection={
                      <ActionIcon size="xs" radius="xs" variant="transparent">
                        <IconX size={rem(14)} />
                      </ActionIcon>
                    }
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </Paper>
  )
}

export default IncidentRow;