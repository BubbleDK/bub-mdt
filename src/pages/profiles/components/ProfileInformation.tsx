import { ActionIcon, Group, Paper, Tooltip, Text, createStyles, Divider, Image, Stack, TextInput, Flex, ScrollArea } from '@mantine/core'
import { IconAddressBook, IconDeviceFloppy, IconDeviceMobile, IconId, IconLinkOff, IconUser, IconColorPicker } from '@tabler/icons-react';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import React from 'react'

const useStyles = createStyles((theme) => ({
  action: {
    backgroundColor: theme.colors.dark[2],
    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    }),
  },

  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
}));

const content =
  'Bubble is awesome<code>Awesome</code> is often a word used about the danish bubble';


const ProfileInformation = () => {
  const { classes, theme } = useStyles();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      Color,
      TextStyle,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
  });

  return (
    <Paper p='lg' withBorder style={{width: 1110, height: 450}}>
      <Group position="apart">
        <Text weight={500}>Citizen</Text>
        <Group spacing={8} mr={0}>
          <Tooltip label="Save" withArrow color="dark" position="bottom">
            <ActionIcon className={classes.action}>
              <IconDeviceFloppy size={16} color={theme.colors.green[6]}/>
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Unlink" withArrow color="dark" position="bottom">
            <ActionIcon className={classes.action} onClick={() => {}}>
              <IconLinkOff size={16} color={theme.colors.gray[5]}/>
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <Divider my="sm" />

      <Flex
        gap="md"
        direction="row"
        wrap="wrap"
        w={630}
      >
        <Image
          width={260}
          height={180}
          src={"citizen[0].image"}
          alt="Placeholder for citizen picture"
          withPlaceholder
          //onClick={() => setCitizenPicture(true)}
        />
        <Stack spacing="xs" w={350}>
          <TextInput icon={<IconId size={16}/>} placeholder={"citizen[0].stateId"} radius="xs" disabled />
          <TextInput icon={<IconUser size={16}/>} placeholder={`${"citizen[0].firstName"} ${"citizen[0].lastName"}`} radius="xs" disabled />
          <TextInput icon={<IconAddressBook size={16}/>} placeholder={"citizen[0].job.charAt(0).toUpperCase() + citizen[0].job.slice(1)"} radius="xs" disabled />
          <TextInput icon={<IconDeviceMobile size={16}/>} placeholder={"citizen[0].phone_number"} radius="xs" disabled/>
        </Stack>
          <RichTextEditor editor={editor} >
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
                <RichTextEditor.Blockquote />
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
                    '#25262b',
                    '#868e96',
                    '#fa5252',
                    '#e64980',
                    '#be4bdb',
                    '#7950f2',
                    '#4c6ef5',
                    '#228be6',
                    '#15aabf',
                    '#12b886',
                    '#40c057',
                    '#82c91e',
                    '#fab005',
                    '#fd7e14',
                  ]}
                />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <ScrollArea style={{ height: 120, width: 625, padding: 0 }}>
              <RichTextEditor.Content style={{ lineHeight: 0.8, padding: 0 }} />
            </ScrollArea>

          </RichTextEditor>
      </Flex>
    </Paper>
  )
}

export default ProfileInformation