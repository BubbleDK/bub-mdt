import { motion } from "framer-motion";
import { ImagePlus, LoaderCircle, Plus, Search, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import type { CriminalProfile, Incident, Officer } from "../../../../typings";
import {
    addIncidentEvidence,
    addIncidentOfficer,
    addIncidentPerson,
    fetchIncidentOfficers,
    searchIncidentPersons,
} from "../../api/incidentsApi";
import { createEvidence, EMPTY_EVIDENCE } from "../../lib/incidentFormatters";
import { takeEvidencePicture } from "../../../mdt/api/camera";
import { FocusTrap } from "focus-trap-react";
import useAppVisibilityStore from "../../../../stores/appVisibilityStore";

export type IncidentDialogType = "officer" | "person" | "evidence";
type IncidentUpdater = (incident: Incident) => Incident;

const DIALOG_COPY = {
    officer: {
        title: "Add officer",
        description: "Search the department roster and assign an officer.",
        placeholder: "Search name or callsign...",
    },
    person: {
        title: "Add involved person",
        description: "Search citizen records and link a person to this case.",
        placeholder: "Search name or citizen ID...",
    },
    evidence: {
        title: "Add evidence",
        description: "Attach an image reference to the evidence locker.",
        placeholder: "",
    },
} as const;

export function IncidentDialog({
    type,
    incident,
    onClose,
    onAdded,
}: {
    type: IncidentDialogType;
    incident: Incident;
    onClose: () => void;
    onAdded: (update: IncidentUpdater) => void;
}) {
    const visible = useAppVisibilityStore((state) => state.showApp);
    const [search, setSearch] = useState("");
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [persons, setPersons] = useState<CriminalProfile[]>([]);
    const [evidenceDraft, setEvidenceDraft] = useState(EMPTY_EVIDENCE);
    const [isLoading, setIsLoading] = useState(type !== "evidence");
    const [pendingId, setPendingId] = useState("");
    const [error, setError] = useState("");
    const copy = DIALOG_COPY[type];

    useEffect(() => {
        if (type !== "officer") return;
        let active = true;
        fetchIncidentOfficers()
            .then((data) => {
                if (active) setOfficers(data);
            })
            .catch(() => {
                if (active) setError("Unable to load officers.");
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });
        return () => {
            active = false;
        };
    }, [type]);

    useEffect(() => {
        if (type !== "person") return;
        setIsLoading(true);
        let active = true;
        const timer = window.setTimeout(() => {
            searchIncidentPersons(search)
                .then((data) => {
                    if (active) setPersons(data);
                })
                .catch(() => {
                    if (active) setError("Unable to search citizens.");
                })
                .finally(() => {
                    if (active) setIsLoading(false);
                });
        }, 250);
        return () => {
            active = false;
            window.clearTimeout(timer);
        };
    }, [search, type]);

    useEffect(() => {
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [onClose]);

    const availableOfficers = useMemo(() => {
        const assignedIds = new Set(incident.officersInvolved.map((officer) => officer.citizenid));
        const needle = search.toLowerCase();
        return officers.filter(
            (officer) =>
                !assignedIds.has(officer.citizenid) &&
                `${officer.firstname} ${officer.lastname} ${officer.callsign}`
                    .toLowerCase()
                    .includes(needle)
        );
    }, [incident.officersInvolved, officers, search]);

    const availablePersons = useMemo(() => {
        const linkedIds = new Set(incident.criminals.map((person) => person.citizenid));
        return persons.filter((person) => !linkedIds.has(person.citizenid));
    }, [incident.criminals, persons]);

    const handleAddOfficer = async (officer: Officer) => {
        setPendingId(officer.citizenid);
        setError("");
        try {
            await addIncidentOfficer(incident.id, officer);
            onAdded((current) => ({
                ...current,
                officersInvolved: [...current.officersInvolved, officer],
            }));
        } catch {
            setError("Officer could not be added.");
            setPendingId("");
        }
    };

    const handleAddPerson = async (person: CriminalProfile) => {
        setPendingId(person.citizenid);
        setError("");
        try {
            const criminal = await addIncidentPerson(incident.id, person);
            onAdded((current) => ({
                ...current,
                criminals: [...current.criminals, criminal],
            }));
        } catch {
            setError("Person could not be added.");
            setPendingId("");
        }
    };

    const handleAddEvidence = async (event: FormEvent) => {
        event.preventDefault();
        const result = createEvidence(evidenceDraft, incident.evidence);
        if (!result.evidence) return setError(result.error ?? "Invalid evidence.");

        setPendingId("evidence");
        setError("");
        try {
            await addIncidentEvidence(incident.id, result.evidence);
            onAdded((current) => ({
                ...current,
                evidence: [...current.evidence, result.evidence!],
            }));
        } catch {
            setError("Evidence could not be added.");
            setPendingId("");
        }
    };

    if (!visible) return null;
    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/65 p-6 backdrop-blur-sm"
            onMouseDown={(event) => event.currentTarget === event.target && onClose()}
        >
            <FocusTrap focusTrapOptions={{ escapeDeactivates: false }}>
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={copy.title}
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    className="w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.1] bg-[#272929] shadow-2xl shadow-black/50"
                >
                    <DialogHeader
                        title={copy.title}
                        description={copy.description}
                        onClose={onClose}
                    />
                    <div className="p-5">
                        {type === "evidence" ? (
                            <>
                                <EvidenceForm
                                    draft={evidenceDraft}
                                    pending={pendingId === "evidence"}
                                    onChange={setEvidenceDraft}
                                    onSubmit={handleAddEvidence}
                                />
                                <button
                                    type="button"
                                    className="mt-3 text-xs text-blue-300 disabled:opacity-40"
                                    disabled={!!pendingId || !evidenceDraft.label.trim()}
                                    onClick={async () => {
                                        setPendingId("camera");
                                        try {
                                            await takeEvidencePicture(
                                                incident.id,
                                                evidenceDraft.label.trim(),
                                                "incident"
                                            );
                                            onClose();
                                        } catch (error) {
                                            setError(
                                                error instanceof Error
                                                    ? error.message
                                                    : "Unable to open camera."
                                            );
                                            setPendingId("");
                                        }
                                    }}
                                >
                                    Take in-game photo
                                </button>
                            </>
                        ) : (
                            <>
                                <SearchField
                                    value={search}
                                    placeholder={copy.placeholder}
                                    onChange={setSearch}
                                />
                                <div className="max-h-72 space-y-2 overflow-y-auto">
                                    {isLoading ? (
                                        <LoadingResults />
                                    ) : type === "officer" ? (
                                        availableOfficers.map((officer) => (
                                            <ResultRow
                                                key={officer.citizenid}
                                                title={`${officer.firstname} ${officer.lastname}`}
                                                meta={`Callsign ${officer.callsign}`}
                                                loading={pendingId === officer.citizenid}
                                                onClick={() => handleAddOfficer(officer)}
                                            />
                                        ))
                                    ) : (
                                        availablePersons.map((person) => (
                                            <ResultRow
                                                key={person.citizenid}
                                                title={`${person.firstname} ${person.lastname}`}
                                                meta={person.citizenid}
                                                loading={pendingId === person.citizenid}
                                                onClick={() => handleAddPerson(person)}
                                            />
                                        ))
                                    )}
                                    {!isLoading &&
                                        (type === "officer" ? availableOfficers : availablePersons)
                                            .length === 0 && (
                                            <div className="py-10 text-center text-xs text-neutral-500">
                                                No available records found.
                                            </div>
                                        )}
                                </div>
                            </>
                        )}
                        {error && <p className="mt-3 text-xs text-red-300">{error}</p>}
                    </div>
                </motion.div>
            </FocusTrap>
        </motion.div>,
        document.body
    );
}

function DialogHeader({
    title,
    description,
    onClose,
}: {
    title: string;
    description: string;
    onClose: () => void;
}) {
    return (
        <div className="flex items-start justify-between border-b border-white/[0.07] p-5">
            <div>
                <h2 className="text-sm font-semibold text-white">{title}</h2>
                <p className="mt-1 text-xs text-neutral-500">{description}</p>
            </div>
            <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-md p-1.5 text-neutral-500 hover:bg-white/[0.06] hover:text-white"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

function SearchField({
    value,
    placeholder,
    onChange,
}: {
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
            <input
                autoFocus
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="h-10 w-full rounded-lg border border-white/[0.09] bg-black/10 pl-10 pr-3 text-xs text-white outline-none placeholder:text-neutral-600 focus:border-blue-500/50"
            />
        </div>
    );
}

function EvidenceForm({
    draft,
    pending,
    onChange,
    onSubmit,
}: {
    draft: typeof EMPTY_EVIDENCE;
    pending: boolean;
    onChange: (value: typeof EMPTY_EVIDENCE) => void;
    onSubmit: (event: FormEvent) => void;
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-3">
            <input
                autoFocus
                value={draft.label}
                onChange={(event) => onChange({ ...draft, label: event.target.value })}
                placeholder="Evidence label"
                className="h-10 w-full rounded-lg border border-white/[0.09] bg-black/10 px-3 text-xs text-white outline-none placeholder:text-neutral-600 focus:border-blue-500/50"
            />
            <input
                value={draft.image}
                onChange={(event) => onChange({ ...draft, image: event.target.value })}
                placeholder="https://image-url..."
                className="h-10 w-full rounded-lg border border-white/[0.09] bg-black/10 px-3 text-xs text-white outline-none placeholder:text-neutral-600 focus:border-blue-500/50"
            />
            {draft.image && (
                <div className="h-32 overflow-hidden rounded-lg border border-white/[0.07]">
                    <img
                        src={draft.image}
                        alt="Evidence preview"
                        className="h-full w-full object-cover"
                    />
                </div>
            )}
            <button
                disabled={pending}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 text-xs font-semibold text-white hover:bg-blue-400 disabled:opacity-50"
            >
                {pending ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                    <ImagePlus className="h-4 w-4" />
                )}
                Add evidence
            </button>
        </form>
    );
}

function LoadingResults() {
    return (
        <div className="flex h-28 items-center justify-center">
            <LoaderCircle className="h-5 w-5 animate-spin text-blue-400" />
        </div>
    );
}

function ResultRow({
    title,
    meta,
    loading,
    onClick,
}: {
    title: string;
    meta: string;
    loading: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            disabled={loading}
            onClick={onClick}
            className="flex w-full items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-left hover:border-blue-400/20 hover:bg-blue-400/[0.05]"
        >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/10 text-blue-300">
                <UserRound className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-neutral-200">{title}</p>
                <p className="mt-0.5 text-[10px] text-neutral-500">{meta}</p>
            </div>
            {loading ? (
                <LoaderCircle className="h-4 w-4 animate-spin text-blue-400" />
            ) : (
                <Plus className="h-4 w-4 text-neutral-600" />
            )}
        </button>
    );
}
