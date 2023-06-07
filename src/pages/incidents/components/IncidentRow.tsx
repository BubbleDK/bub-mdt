import { ActionIcon, Divider, Group, Paper, ScrollArea, Text, TextInput, Tooltip, createStyles } from '@mantine/core'
import { IconDeviceFloppy, IconLinkOff, IconPencilPlus } from '@tabler/icons-react'
import React from 'react'
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
}));

interface Props {
  handleUnlink: (data: IncidentData | null) => void;
}

const IncidentRow = (props: Props) => {
  const { classes, theme } = useStyles();
  const { selectedIncident } = useStoreIncidents();
  
  const form = useForm({
    initialValues: {
      titel: '',
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

      <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
        <TextInput radius='xs' variant="filled" placeholder="Place titel here..." {...form.getInputProps('titel')} />

        <RichTextEditor editor={editor} styles={{ content: { backgroundColor: 'rgb(34, 35, 37)' }, toolbar: { backgroundColor: '#252628' }}} style={{borderRadius: 2}}>
          <RichTextEditor.Toolbar sticky>
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
      </div>
    </Paper>
  )
}

export default IncidentRow;