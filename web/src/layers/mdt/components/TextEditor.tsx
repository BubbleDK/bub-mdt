import React, { useEffect, useState } from 'react';
import { RichTextEditor, Link, RichTextEditorStylesNames } from '@mantine/tiptap';
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
import { IconDeviceFloppy } from '@tabler/icons-react';
import { ActionIcon, ScrollArea, Styles, Transition, createStyles } from '@mantine/core';

interface TextEditorProps {
  content?: string;
  editable? : boolean;
  onChange?: (value?: string) => void;
  onSave?: (value: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  styles?: Styles<RichTextEditorStylesNames, Record<string, any>>;
  contentAreaStyle?: React.CSSProperties;
}

const useStyles = createStyles({
  saveButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 99,
  },
});

const TextEditor : React.FC<TextEditorProps> = ({ content = '<p></p>', onChange, styles, contentAreaStyle, onSave }) => {
  const { classes } = useStyles();
  const [canSave, setCanSave] = useState(false);

  const editor = useEditor({
    content,

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
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
  });

  useEffect(() => {
    editor?.commands.setContent(content, true);
  }, [content])

  useEffect(() => {
    onChange && onChange(editor?.getHTML());

    if (!onSave) return;
    const timer = setTimeout(() => {
      if (editor?.getHTML() !== content) setCanSave(true);
      else setCanSave(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [editor?.getHTML()]);

  return (
    <>
      <RichTextEditor editor={editor} styles={styles} style={{borderRadius: 2}}>
        <RichTextEditor.Toolbar sticky >
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
        {editor && (
          <ScrollArea style={contentAreaStyle}>
            <Transition mounted={!!(canSave && onSave)} transition="slide-down">
              {(style) => (
                <ActionIcon
                  style={style}
                  className={classes.saveButton}
                  color="dark"
                  variant="default"
                  size={26}
                  onClick={() => {
                    setCanSave(false);
                    onSave && onSave(editor?.getHTML());
                  }}
                >
                  <IconDeviceFloppy size={20} />
                </ActionIcon>
              )}
            </Transition>
            <RichTextEditor.Content />
          </ScrollArea>
        )}
      </RichTextEditor>
    </>
  )
}

export default TextEditor;