import { Stack } from '@mantine/core'
import React from 'react'
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Image from '@tiptap/extension-image'
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';

interface Props {
  contents: string;
}

const AnnouncementModal = (props: Props) => {
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
      Image,
      TextAlign
    ],
    content: props.contents,
    editable: false,
  });

  return (
    <Stack>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Content />
      </RichTextEditor>
    </Stack>
  )
}

export default AnnouncementModal;