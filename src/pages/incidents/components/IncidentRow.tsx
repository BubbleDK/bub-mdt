import { ActionIcon, Badge, Button, Center, Divider, Group, Paper, Popover, ScrollArea, Select, Text, TextInput, Tooltip, UnstyledButton, createStyles, rem } from '@mantine/core'
import { IconDeviceFloppy, IconLinkOff, IconPencilPlus, IconLocation, IconPlus, IconX } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { useStoreIncidents } from '../../../store/incidentsStore';
import { IncidentData } from '../../../typings';
import { useForm } from '@mantine/form';
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";

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
}

const IncidentRow = (props: Props) => {
  const { classes, theme } = useStyles();
  const { selectedIncident } = useStoreIncidents();
  const [openedTagPopover, setOpenedTagPopover] = useState(false);
  const form = useForm({
    initialValues: {
      title: '',
      location: '',
    },
  });
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Underline,
        Link,
        Superscript,
        SubScript,
        Highlight,
        Color,
        TextStyle,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
      ],
      editable: true,
      content: 'Incident description...',
    }
  );

  useEffect(() => {
    if (selectedIncident) {
      form.setValues({
        title: selectedIncident.title
      })
    } else {
      form.setValues({
        title: '',
        location: '',
      })
    }
  }, [selectedIncident]);

  function handleSubmit(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <Paper p='md' withBorder style={{width: 550, backgroundColor: 'rgb(34, 35, 37)'}}>
      <Group position='apart'>
        <Text weight={500} c={'white'}>{selectedIncident ? 'Edit' : 'Create'} Incident</Text>
				<Group spacing={8} mr={0}>
          {selectedIncident ? (
            <Tooltip label='Save' withArrow color='dark' position='bottom'>
              <ActionIcon className={classes.action} onClick={() => { }}>
                <IconDeviceFloppy size={16} color={theme.colors.green[6]} />
              </ActionIcon>
            </Tooltip>
          ) : (
            <Tooltip label='Create' withArrow color='dark' position='bottom'>
              <ActionIcon className={classes.action} onClick={() => { }}>
                <IconPencilPlus size={16} color={theme.colors.green[6]} />
              </ActionIcon>
					  </Tooltip>
          )}
					<Tooltip label='Unlink' withArrow color='dark' position='bottom'>
						<ActionIcon className={classes.action} onClick={() => { props.handleUnlink(null); }}>
							<IconLinkOff size={16} color={theme.colors.gray[5]} />
						</ActionIcon>
					</Tooltip>
				</Group>
			</Group>

      <Divider my='sm' />

      <ScrollArea h={800} scrollbarSize={4} type="never">
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          <TextInput radius='xs' variant="filled" placeholder="Place title here..." {...form.getInputProps('title')} />

          <RichTextEditor editor={editor} styles={{ content: { backgroundColor: 'rgb(34, 35, 37)' }, toolbar: { backgroundColor: '#252628', zIndex: 999 }}} style={{borderRadius: 2}}>
            <RichTextEditor.Toolbar>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.ColorPicker
                  colors={[
                    "#25262b",
                    "#868e96",
                    "#fa5252",
                    "#e64980",
                    "#be4bdb",
                    "#7950f2",
                    "#4c6ef5",
                    "#228be6",
                    "#15aabf",
                    "#12b886",
                    "#40c057",
                    "#82c91e",
                    "#fab005",
                    "#fd7e14",
                  ]}
                />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <ScrollArea style={{ height: 300, width: 510 }}>
              <RichTextEditor.Content />
            </ScrollArea>
          </RichTextEditor>

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
                    variant="light"
                    pl={3}
                    style={{margin: 2.5}}
                    leftSection={
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
                  Involved Reports
                </Text>

                <Tooltip label='Add Report' withArrow color='dark' position="top-end">
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
                  Gallary
                </Text>

                <Tooltip label='Add Picture' withArrow color='dark' position="top-end">
                  <ActionIcon className={classes.action} onClick={() => { }}>
                    <IconPlus size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </div>
          </div>
        </div>
      </ScrollArea>
    </Paper>
  )
}

export default IncidentRow;