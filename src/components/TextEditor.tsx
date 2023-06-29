import React, { useState } from 'react';
import { RichTextEditor, Link, RichTextEditorStylesNames } from '@mantine/tiptap';
import { Extensions, useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Image from '@tiptap/extension-image'
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { IconPhoto } from '@tabler/icons-react';
import { Button, Popover, ScrollArea, Space, Styles, TextInput } from '@mantine/core';

interface TextEditorProps {
    tiptapExtensions?: Extensions,
    initialContent: string,
    editable? : boolean
    onChange: (newContent:string) => void,
    styles? : Styles<RichTextEditorStylesNames, Record<string, any>>
    contentAreaStyle?: React.CSSProperties
}

const DEFAULT_EXTENSIONS: Extensions = [
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
]

const TextEditor : React.FC<TextEditorProps> = ({tiptapExtensions,initialContent,editable,onChange,styles,contentAreaStyle}) => {
    const [addingImage,setAddingImage] = useState<boolean>(false)
    const [imageURLInput,setImageURLInput] = useState<string>('')

    const editor = useEditor({
        extensions: tiptapExtensions ? tiptapExtensions : DEFAULT_EXTENSIONS,
        content: initialContent,
        editable: editable,
        onUpdate({editor}) {
            onChange(editor.getHTML())
        }
    });

    //Avoids having to assert editor != null within JSX
    if(!editor){
        return <></>
    }

    return(
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
                    <Popover opened={addingImage} onClose={() => setAddingImage(false)}>
                        <Popover.Target>
                            <RichTextEditor.Control onClick={() => setAddingImage(true)} title='Insert Image'>
                                <IconPhoto size='1rem'/>
                            </RichTextEditor.Control>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <TextInput label='Image URL' value={imageURLInput} onChange={(e) => setImageURLInput(e.currentTarget.value)}></TextInput>
                            <Space h='lg'/>
                            <Button onClick={() => {
                                if(editor.commands.setImage({ src: imageURLInput })){
                                    setAddingImage(false)
                                    setImageURLInput('')
                                }
                            }}>Add</Button>
                        </Popover.Dropdown>
                    </Popover>
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
            <ScrollArea style={contentAreaStyle}>
                <RichTextEditor.Content />
            </ScrollArea>
        </RichTextEditor>
        </>
    )
}

export default TextEditor;