import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowLeft,
    BadgeDollarSign,
    CalendarDays,
    Camera,
    Clock3,
    FileWarning,
    Fingerprint,
    Gavel,
    LoaderCircle,
    Shield,
    UserRound,
    UsersRound,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RichTextEditor } from "../../../components/RichTextEditor";
import type { Evidence, Incident, Officer, PartialIncidentData } from "../../../typings";
import {
    removeIncidentEvidence,
    removeIncidentOfficer,
    removeIncidentPerson,
    saveIncidentNarrative,
} from "../api/incidentsApi";
import { formatIncidentDate } from "../lib/incidentFormatters";
import { useIncident } from "../model/useIncidents";
import { IncidentDialog, type IncidentDialogType } from "./components/IncidentDialog";
import {
    AddButton,
    EmptyCollection,
    IncidentPanel,
    Metric,
    RemoveButton,
} from "./components/IncidentUi";

interface IncidentLocationState {
    summary?: PartialIncidentData;
}

type IncidentUpdater = (incident: Incident) => Incident;

export function IncidentDetailPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const incidentId = Number(useParams().incidentId);
    const summary = (location.state as IncidentLocationState | null)?.summary;
    const incidentQuery = useIncident(incidentId);
    const incident = incidentQuery.data;
    const [openDialog, setOpenDialog] = useState<IncidentDialogType | null>(null);
    const [removingId, setRemovingId] = useState("");

    const updateIncident = (update: IncidentUpdater) => {
        queryClient.setQueryData<Incident>(["incident", incidentId], (current) =>
            current ? update(current) : current
        );
    };

    const runRemoval = async (
        pendingId: string,
        request: () => Promise<void>,
        update: IncidentUpdater
    ) => {
        setRemovingId(pendingId);
        try {
            await request();
            updateIncident(update);
        } finally {
            setRemovingId("");
        }
    };

    if (incidentQuery.isLoading) return <IncidentLoading />;
    if (!incident) {
        return <IncidentUnavailable onBack={() => navigate("/incidents")} />;
    }

    const totalFine = incident.criminals.reduce(
        (total, criminal) => total + criminal.penalty.fine,
        0
    );
    const totalTime = incident.criminals.reduce(
        (total, criminal) => total + criminal.penalty.time,
        0
    );

    const saveNarrative = async (contents: string) => {
        await saveIncidentNarrative(incidentId, contents);
        updateIncident((current) => ({ ...current, description: contents }));
    };

    const removeOfficer = (officer: Officer) =>
        runRemoval(
            `officer-${officer.citizenid}`,
            () => removeIncidentOfficer(incidentId, officer.citizenid),
            (current) => ({
                ...current,
                officersInvolved: current.officersInvolved.filter(
                    (item) => item.citizenid !== officer.citizenid
                ),
            })
        );

    const removePerson = (citizenid: string) =>
        runRemoval(
            `person-${citizenid}`,
            () => removeIncidentPerson(incidentId, citizenid),
            (current) => ({
                ...current,
                criminals: current.criminals.filter(
                    (item) => item.citizenid !== citizenid
                ),
            })
        );

    const removeEvidence = (evidence: Evidence) => {
        const pendingId = getEvidencePendingId(evidence);
        return runRemoval(
            pendingId,
            () => removeIncidentEvidence(incidentId, evidence),
            (current) => ({
                ...current,
                evidence: current.evidence.filter(
                    (item) => item.label !== evidence.label || item.image !== evidence.image
                ),
            })
        );
    };

    return (
        <motion.main
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 18 }}
            className="h-full overflow-y-auto"
        >
            <IncidentToolbar incidentId={incident.id} onBack={() => navigate(-1)} />
            <div className="p-6">
                <IncidentHero incident={incident} summary={summary} />
                <div className="mt-5 grid grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)] gap-5">
                    <div className="space-y-5">
                        <IncidentPanel icon={FileWarning} eyebrow="Case narrative" title="Incident summary">
                            <RichTextEditor
                                content={incident.description ?? "<p></p>"}
                                onSave={saveNarrative}
                                height={230}
                                placeholder="Add the incident narrative..."
                            />
                        </IncidentPanel>
                        <PeoplePanel
                            incident={incident}
                            removingId={removingId}
                            onAdd={() => setOpenDialog("person")}
                            onRemove={removePerson}
                        />
                        <EvidencePanel
                            evidence={incident.evidence}
                            removingId={removingId}
                            onAdd={() => setOpenDialog("evidence")}
                            onRemove={removeEvidence}
                        />
                    </div>
                    <aside className="space-y-5">
                        <div className="grid grid-cols-2 gap-3">
                            <Metric icon={Clock3} label="Total sentence" value={`${totalTime} mo.`} />
                            <Metric icon={BadgeDollarSign} label="Total fines" value={`$${totalFine.toLocaleString()}`} />
                        </div>
                        <OfficersPanel
                            officers={incident.officersInvolved}
                            removingId={removingId}
                            onAdd={() => setOpenDialog("officer")}
                            onRemove={removeOfficer}
                        />
                        <RecordIntegrity />
                    </aside>
                </div>
            </div>
            <AnimatePresence>
                {openDialog && (
                    <IncidentDialog
                        type={openDialog}
                        incident={incident}
                        onClose={() => setOpenDialog(null)}
                        onAdded={(update) => {
                            updateIncident(update);
                            setOpenDialog(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.main>
    );
}

function IncidentToolbar({ incidentId, onBack }: { incidentId: number; onBack: () => void }) {
    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.07] bg-brand-dark/90 px-6 backdrop-blur-xl">
            <button onClick={onBack} className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-neutral-400 hover:bg-white/[0.05] hover:text-white">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5" />
                Back to incidents
            </button>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>Case file</span>
                <span className="rounded-md border border-white/[0.09] bg-white/[0.045] px-2 py-1 font-mono text-neutral-300">#{incidentId}</span>
            </div>
        </header>
    );
}

function IncidentHero({ incident, summary }: { incident: Incident; summary?: PartialIncidentData }) {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-white/[0.075] bg-gradient-to-br from-white/[0.055] to-white/[0.018] p-6 shadow-2xl shadow-black/10">
            <div className="absolute right-0 top-0 h-full w-1 bg-blue-500/70" />
            <div className="mb-5 flex items-center gap-2">
                <span className="rounded-md border border-blue-400/20 bg-blue-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300">Active record</span>
                <span className="text-xs text-neutral-500">Live case file</span>
            </div>
            <h1 className="max-w-4xl text-2xl font-semibold tracking-tight text-white">{incident.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-400">
                <span className="flex items-center gap-2"><Fingerprint className="h-3.5 w-3.5 text-neutral-500" />Incident #{incident.id}</span>
                <span className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-neutral-500" />{formatIncidentDate(summary?.date)}</span>
                {summary?.author && <span className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-neutral-500" />Filed by {summary.author}</span>}
            </div>
        </section>
    );
}

function PeoplePanel({ incident, removingId, onAdd, onRemove }: { incident: Incident; removingId: string; onAdd: () => void; onRemove: (citizenid: string) => void }) {
    return (
        <IncidentPanel icon={UsersRound} eyebrow={`${incident.criminals.length} linked`} title="Involved persons" action={<AddButton label="Add person" onClick={onAdd} />}>
            {incident.criminals.length === 0 ? (
                <EmptyCollection icon={UserRound} text="No involved persons attached" />
            ) : (
                <div className="space-y-3">
                    {incident.criminals.map((criminal) => (
                        <div key={criminal.citizenid} className="rounded-xl border border-white/[0.07] bg-black/10 p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-400/[0.08] text-red-300"><UserRound className="h-5 w-5" /></div>
                                    <div><h3 className="text-sm font-medium text-white">{criminal.firstname} {criminal.lastname}</h3><p className="mt-0.5 font-mono text-[11px] text-neutral-500">{criminal.citizenid}</p></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`rounded-md px-2 py-1 text-[10px] font-semibold uppercase ${criminal.processed ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-300"}`}>{criminal.processed ? "Processed" : "Pending"}</span>
                                    <RemoveButton loading={removingId === `person-${criminal.citizenid}`} label={`Remove ${criminal.firstname} ${criminal.lastname}`} onClick={() => onRemove(criminal.citizenid)} />
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {criminal.charges.map((charge, index) => <span key={`${charge.label}-${index}`} className="rounded-md border border-red-400/15 bg-red-400/[0.06] px-2.5 py-1.5 text-xs text-red-200">{charge.count > 1 && `${charge.count}× `}{charge.label}</span>)}
                                {criminal.charges.length === 0 && <span className="text-xs text-neutral-500">No charges attached</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </IncidentPanel>
    );
}

function EvidencePanel({ evidence, removingId, onAdd, onRemove }: { evidence: Evidence[]; removingId: string; onAdd: () => void; onRemove: (evidence: Evidence) => void }) {
    return (
        <IncidentPanel icon={Camera} eyebrow={`${evidence.length} items`} title="Evidence locker" action={<AddButton label="Add evidence" onClick={onAdd} />}>
            {evidence.length === 0 ? <EmptyCollection icon={Camera} text="No evidence has been logged" /> : (
                <div className="grid grid-cols-2 gap-3">
                    {evidence.map((item) => {
                        const pendingId = getEvidencePendingId(item);
                        return <figure key={pendingId} className="group relative overflow-hidden rounded-xl border border-white/[0.07] bg-black/10"><img src={item.image} alt={item.label} className="h-32 w-full object-cover opacity-80" /><figcaption className="p-3 pr-12 text-xs text-neutral-300">{item.label}</figcaption><div className="absolute bottom-2 right-2 opacity-0 transition group-hover:opacity-100"><RemoveButton loading={removingId === pendingId} label={`Remove ${item.label}`} onClick={() => onRemove(item)} /></div></figure>;
                    })}
                </div>
            )}
        </IncidentPanel>
    );
}

function OfficersPanel({ officers, removingId, onAdd, onRemove }: { officers: Officer[]; removingId: string; onAdd: () => void; onRemove: (officer: Officer) => void }) {
    return (
        <IncidentPanel icon={Shield} eyebrow={`${officers.length} assigned`} title="Officers involved" action={<AddButton label="Add officer" onClick={onAdd} />}>
            {officers.length === 0 ? <EmptyCollection text="No officers assigned" compact /> : (
                <div className="space-y-2">{officers.map((officer) => <div key={officer.citizenid} className="flex items-center gap-3 rounded-lg border border-white/[0.055] bg-white/[0.02] p-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/10 text-xs font-bold text-blue-300">{officer.callsign}</div><div className="min-w-0 flex-1"><p className="truncate text-sm text-neutral-200">{officer.firstname} {officer.lastname}</p><p className="mt-0.5 text-[11px] text-neutral-500">Los Santos Police Department</p></div><RemoveButton loading={removingId === `officer-${officer.citizenid}`} label={`Remove ${officer.firstname} ${officer.lastname}`} onClick={() => onRemove(officer)} /></div>)}</div>
            )}
        </IncidentPanel>
    );
}

function RecordIntegrity() {
    return <div className="rounded-xl border border-blue-400/15 bg-blue-400/[0.055] p-4"><div className="flex items-center gap-2 text-xs font-semibold text-blue-300"><Gavel className="h-4 w-4" />Record integrity</div><p className="mt-2 text-xs leading-5 text-neutral-400">Narrative and linked records save directly to this incident.</p></div>;
}

function IncidentLoading() {
    return <div className="flex h-full items-center justify-center"><LoaderCircle className="h-6 w-6 animate-spin text-blue-400" /></div>;
}

function IncidentUnavailable({ onBack }: { onBack: () => void }) {
    return <div className="flex h-full flex-col items-center justify-center text-center"><FileWarning className="mb-3 h-9 w-9 text-neutral-600" /><h1 className="font-semibold text-white">Incident unavailable</h1><button onClick={onBack} className="mt-3 text-sm text-blue-400">Return to incidents</button></div>;
}

function getEvidencePendingId(evidence: Evidence) {
    return `evidence-${evidence.label}-${evidence.image}`;
}
