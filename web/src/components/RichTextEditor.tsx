import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Eraser, Highlighter, Italic, Link2, List, ListOrdered, LoaderCircle, Minus, Palette, Save, Strikethrough, Underline as UnderlineIcon, Unlink } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface RichTextEditorProps {
    content?: string;
    onChange?: (html: string) => void;
    onSave?: (html: string) => void | Promise<void>;
    height?: number;
    placeholder?: string;
}

const COLORS = ["#f5f5f5", "#a3a3a3", "#60a5fa", "#22d3ee", "#34d399", "#facc15", "#fb923c", "#f87171", "#e879f9"];

export function RichTextEditor({ content = "<p></p>", onChange, onSave, height = 220, placeholder = "Start writing..." }: RichTextEditorProps) {
    const [canSave, setCanSave] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(false);
    const [showColors, setShowColors] = useState(false);
    const timerRef = useRef<number | undefined>(undefined);
    const contentRef = useRef(content);
    const editor = useEditor({
        content,
        extensions: [StarterKit, Underline, Link.configure({ openOnClick: false }), Superscript, Subscript, Highlight.configure({ multicolor: true }), Color, TextStyle, Image, TextAlign.configure({ types: ["heading", "paragraph"] })],
        editorProps: { attributes: { class: "incident-rich-editor__content", "aria-label": "Rich text editor", "data-placeholder": placeholder } },
        onUpdate: ({ editor: current }) => {
            const html = current.getHTML();
            setSaveError(false);
            onChange?.(html);
            window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => setCanSave(html !== contentRef.current), 500);
        },
    });

    useEffect(() => {
        if (editor && editor.getHTML() !== content) {
            contentRef.current = content;
            editor.commands.setContent(content, false);
            setCanSave(false);
        }
    }, [content, editor]);
    useEffect(() => () => window.clearTimeout(timerRef.current), []);

    if (!editor) return <div className="h-64 animate-pulse rounded-xl border border-white/[0.07] bg-black/10" />;

    const save = async () => {
        if (!onSave || !canSave) return;
        setIsSaving(true);
        setSaveError(false);
        const html = editor.getHTML();
        try { await onSave(html); contentRef.current = html; setCanSave(false); }
        catch { setSaveError(true); }
        finally { setIsSaving(false); }
    };
    const setLink = () => {
        const previous = editor.getAttributes("link").href as string | undefined;
        const url = window.prompt("Link URL", previous ?? "https://");
        if (url === null) return;
        if (!url.trim()) editor.chain().focus().extendMarkRange("link").unsetLink().run();
        else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    return <div className="relative overflow-hidden rounded-xl border border-white/[0.09] bg-[#242626] focus-within:border-blue-500/35 focus-within:ring-4 focus-within:ring-blue-500/[0.06]">
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-white/[0.075] bg-[#2c2e2e] p-2">
            <Control active={editor.isActive("bold")} label="Bold" onClick={() => editor.chain().focus().toggleBold().run()}><Bold /></Control>
            <Control active={editor.isActive("italic")} label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic /></Control>
            <Control active={editor.isActive("underline")} label="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon /></Control>
            <Control active={editor.isActive("strike")} label="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough /></Control>
            <Control label="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}><Eraser /></Control>
            <Control active={editor.isActive("highlight")} label="Highlight" onClick={() => editor.chain().focus().toggleHighlight({ color: "#a16207" }).run()}><Highlighter /></Control>
            <Control active={editor.isActive("superscript")} label="Superscript" onClick={() => editor.chain().focus().toggleSuperscript().run()}><span className="text-[11px] font-semibold">X<sup>2</sup></span></Control>
            <Control active={editor.isActive("subscript")} label="Subscript" onClick={() => editor.chain().focus().toggleSubscript().run()}><span className="text-[11px] font-semibold">X<sub>2</sub></span></Control>
            <Divider />
            <Control label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus /></Control>
            <Control active={editor.isActive("bulletList")} label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()}><List /></Control>
            <Control active={editor.isActive("orderedList")} label="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered /></Control>
            <Divider />
            <Control active={editor.isActive("link")} label="Add link" onClick={setLink}><Link2 /></Control>
            <Control label="Remove link" onClick={() => editor.chain().focus().unsetLink().run()}><Unlink /></Control>
            <Divider />
            <Control active={editor.isActive({ textAlign: "left" })} label="Align left" onClick={() => editor.chain().focus().setTextAlign("left").run()}><AlignLeft /></Control>
            <Control active={editor.isActive({ textAlign: "center" })} label="Align center" onClick={() => editor.chain().focus().setTextAlign("center").run()}><AlignCenter /></Control>
            <Control active={editor.isActive({ textAlign: "justify" })} label="Justify" onClick={() => editor.chain().focus().setTextAlign("justify").run()}><AlignJustify /></Control>
            <Control active={editor.isActive({ textAlign: "right" })} label="Align right" onClick={() => editor.chain().focus().setTextAlign("right").run()}><AlignRight /></Control>
            <Divider />
            <div className="relative"><Control active={showColors} label="Text color" onClick={() => setShowColors((open) => !open)}><Palette /></Control>{showColors && <div className="absolute left-0 top-9 z-30 grid w-32 grid-cols-5 gap-1 rounded-lg border border-white/[0.1] bg-[#303232] p-2 shadow-xl">{COLORS.map((color) => <button type="button" key={color} aria-label={`Use ${color}`} onClick={() => { editor.chain().focus().setColor(color).run(); setShowColors(false); }} className="h-5 w-5 rounded border border-white/10" style={{ backgroundColor: color }} />)}</div>}</div>
        </div>
        <div className="overflow-y-auto" style={{ height }}><EditorContent editor={editor} /></div>
        {onSave && <div className="flex h-12 items-center justify-between border-t border-white/[0.075] bg-[#292b2b] px-3">
            <span className={`text-[11px] ${saveError ? "text-red-300" : canSave ? "text-amber-300/80" : "text-neutral-600"}`}>
                {saveError ? "Changes could not be saved." : canSave ? "Unsaved changes" : "No changes to save"}
            </span>
            <button type="button" onClick={save} disabled={!canSave || isSaving} aria-label="Save changes" className="flex h-8 min-w-24 items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 text-xs font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-white/[0.055] disabled:text-neutral-600 disabled:shadow-none">
                {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{isSaving ? "Saving" : saveError ? "Retry" : "Save"}
            </button>
        </div>}
    </div>;
}

function Control({ active = false, label, onClick, children }: { active?: boolean; label: string; onClick: () => void; children: ReactNode }) { return <button type="button" title={label} aria-label={label} aria-pressed={active} onClick={onClick} className={`flex h-7 w-7 items-center justify-center rounded-md transition [&_svg]:h-3.5 [&_svg]:w-3.5 ${active ? "bg-blue-500/20 text-blue-300" : "text-neutral-400 hover:bg-white/[0.07] hover:text-white"}`}>{children}</button>; }
function Divider() { return <span className="mx-1 h-5 w-px bg-white/[0.08]" />; }
