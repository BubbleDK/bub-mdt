import { lazy, Suspense } from "react";
import type { RichTextEditorProps } from "./RichTextEditorContent";
const Editor = lazy(() =>
    import("./RichTextEditorContent").then((module) => ({ default: module.RichTextEditor }))
);
export function RichTextEditor(props: RichTextEditorProps) {
    return (
        <Suspense
            fallback={
                <div
                    role="status"
                    className="rounded-xl border border-white/[0.07] bg-black/10 p-4 text-neutral-400"
                    style={{ minHeight: props.height ?? 220 }}
                >
                    Loading editor…
                </div>
            }
        >
            <Editor {...props} />
        </Suspense>
    );
}
