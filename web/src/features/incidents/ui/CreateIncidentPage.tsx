import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, FilePlus2, ImagePlus, LoaderCircle, Plus, Trash2, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { Evidence, PartialIncidentData } from "../../../typings";
import { RichTextEditor } from "../../../components/RichTextEditor";
import { createIncident } from "../api/incidentsApi";

const EMPTY_EVIDENCE: Evidence = { label: "", image: "" };
const evidenceKey = (item: Evidence) => `${item.label}\u0000${item.image}`;

export function CreateIncidentPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [title, setTitle] = useState("");
    const [narrative, setNarrative] = useState("<p></p>");
    const [evidence, setEvidence] = useState<Evidence[]>([]);
    const [draft, setDraft] = useState<Evidence>(EMPTY_EVIDENCE);
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const addEvidence = () => {
        if (!draft.label.trim() || !draft.image.trim()) return setError("Add both a label and an image URL.");
        try { new URL(draft.image); } catch { return setError("Enter a valid image URL."); }
        const item = { label: draft.label.trim(), image: draft.image.trim() };
        if (evidence.some((current) => evidenceKey(current) === evidenceKey(item))) return setError("This evidence item is already attached.");
        setEvidence((current) => [...current, item]); setDraft(EMPTY_EVIDENCE); setError("");
    };

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        if (!title.trim()) return setError("An incident title is required.");
        setIsSaving(true); setError("");
        try {
            const id = await createIncident(title.trim(), narrative, evidence);
            await queryClient.invalidateQueries({ queryKey: ["incidents"] });
            navigate(`/incidents/${id}`, { replace: true, state: { summary: { id, title: title.trim(), author: "Current officer", date: Date.now() } satisfies PartialIncidentData } });
        } catch { setError("The incident could not be created. Check the connection and try again."); setIsSaving(false); }
    };

    return <motion.main initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 18 }} className="flex h-full flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.07] bg-brand-dark/90 px-6"><button type="button" onClick={() => navigate(-1)} className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-neutral-400 hover:bg-white/[0.05] hover:text-white"><ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5" />Cancel</button><span className="text-xs text-neutral-500">New case file</span></header>
        <form onSubmit={submit} className="min-h-0 flex-1 overflow-y-auto"><div className="mx-auto max-w-5xl p-6 pb-28"><div className="mb-7 flex items-start gap-4"><div className="rounded-xl border border-blue-400/20 bg-blue-400/10 p-3 text-blue-300"><FilePlus2 className="h-5 w-5" /></div><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400">Case management</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">Create incident</h1><p className="mt-1 text-sm text-neutral-500">Start with the core case information. People and officers can be linked from the incident afterward.</p></div></div>
            <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(310px,0.75fr)] items-start gap-5"><div className="space-y-5"><Section number="01" title="Case information" description="Use a specific title that is easy to recognise in search results."><label className="block"><span className="mb-2 block text-xs font-medium text-neutral-300">Incident title <span className="text-red-400">*</span></span><input autoFocus value={title} maxLength={120} onChange={(event) => { setTitle(event.target.value); setError(""); }} placeholder="e.g. Armed robbery — Vespucci Boulevard" className="h-11 w-full rounded-lg border border-white/[0.09] bg-black/10 px-3.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10" /><span className="mt-1.5 block text-right text-[10px] text-neutral-600">{title.length}/120</span></label></Section><Section number="02" title="Incident narrative" description="Record the sequence of events and actions taken by responding units."><RichTextEditor content={narrative} onChange={setNarrative} height={285} placeholder="Document what happened, where units responded, and the current case status..." /></Section></div>
                <Section number="03" title="Initial evidence" description="Optionally attach known image references now."><div className="space-y-2.5"><input value={draft.label} onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))} placeholder="Evidence label" className="h-10 w-full rounded-lg border border-white/[0.09] bg-black/10 px-3 text-xs text-white outline-none placeholder:text-neutral-600 focus:border-blue-500/50" /><input value={draft.image} onChange={(event) => setDraft((current) => ({ ...current, image: event.target.value }))} placeholder="https://image-url..." className="h-10 w-full rounded-lg border border-white/[0.09] bg-black/10 px-3 text-xs text-white outline-none placeholder:text-neutral-600 focus:border-blue-500/50" /><button type="button" onClick={addEvidence} className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.04] text-xs font-medium text-neutral-300 hover:bg-white/[0.08] hover:text-white"><ImagePlus className="h-4 w-4" />Attach evidence</button></div><div className="mt-4 space-y-2">{evidence.map((item) => <div key={evidenceKey(item)} className="flex items-center gap-3 rounded-lg border border-white/[0.065] bg-black/10 p-2"><img src={item.image} alt="" className="h-11 w-12 rounded-md object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-neutral-200">{item.label}</p><p className="mt-0.5 truncate text-[10px] text-neutral-600">{item.image}</p></div><button type="button" onClick={() => setEvidence((current) => current.filter((entry) => evidenceKey(entry) !== evidenceKey(item)))} className="rounded-md p-2 text-neutral-600 hover:bg-red-400/10 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></button></div>)}{!evidence.length && <div className="flex flex-col items-center rounded-lg border border-dashed border-white/[0.08] py-7"><Camera className="h-5 w-5 text-neutral-600" /><p className="mt-2 text-xs text-neutral-500">No evidence attached</p></div>}</div></Section></div></div>
            <footer className="sticky bottom-0 flex h-20 items-center justify-between border-t border-white/[0.07] bg-brand-dark/95 px-7 backdrop-blur-xl"><p className={`max-w-lg text-xs ${error ? "text-red-300" : "text-neutral-500"}`}>{error || "The incident can be expanded after creation."}</p><div className="flex gap-2"><button type="button" onClick={() => navigate(-1)} className="flex h-10 items-center gap-2 rounded-lg px-4 text-xs font-medium text-neutral-400 hover:bg-white/[0.05] hover:text-white"><X className="h-4 w-4" />Cancel</button><button type="submit" disabled={isSaving} className="flex h-10 min-w-36 items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 text-xs font-semibold text-white hover:bg-blue-400 disabled:opacity-50">{isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}{isSaving ? "Creating..." : "Create incident"}</button></div></footer>
        </form>
    </motion.main>;
}

function Section({ number, title, description, children }: { number: string; title: string; description: string; children: React.ReactNode }) { return <section className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5"><div className="mb-5 flex gap-3"><span className="font-mono text-[10px] font-semibold text-blue-400">{number}</span><div><h2 className="text-sm font-semibold text-white">{title}</h2><p className="mt-1 text-xs leading-5 text-neutral-500">{description}</p></div></div>{children}</section>; }
