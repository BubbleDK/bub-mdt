import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, FilePlus2, FileSearch, RotateCcw, Search, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, type SelectOption } from "../../../components/Select";
import type { PartialIncidentData } from "../../../typings";
import { useDebouncedValue } from "../../../utils/useDebouncedValue";
import { useIncidentSearch } from "../model/useIncidents";

const formatDate = (date: number) => new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
}).format(date);

type DateFilter = "all" | "7" | "30" | "90";
type SortOrder = "newest" | "oldest" | "number";

const DATE_FILTERS: { label: string; value: DateFilter }[] = [
    { label: "Any time", value: "all" },
    { label: "Last 7 days", value: "7" },
    { label: "Last 30 days", value: "30" },
    { label: "Last 90 days", value: "90" },
];

const SORT_OPTIONS: SelectOption[] = [
    { label: "Newest first", value: "newest", description: "Most recently filed cases" },
    { label: "Oldest first", value: "oldest", description: "Earliest filed cases" },
    { label: "Highest case number", value: "number", description: "Descending incident number" },
];

export function IncidentSearchPage() {
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState<DateFilter>("all");
    const [authorFilter, setAuthorFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
    const { debouncedValue, isDebouncing } = useDebouncedValue(search, 250);
    const navigate = useNavigate();
    const query = useIncidentSearch();
    const authors = useMemo(() =>
        Array.from(new Set((query.data ?? []).map((incident) => incident.author))).sort(),
    [query.data]);
    const authorOptions = useMemo<SelectOption[]>(() => [
        { label: "All reporting officers", value: "all" },
        ...authors.map((author) => ({ label: author, value: author })),
    ], [authors]);
    const incidents = useMemo(() => {
        const needle = debouncedValue.trim().toLowerCase();
        const cutoff = dateFilter === "all"
            ? 0
            : Date.now() - Number(dateFilter) * 86_400_000;
        return (query.data ?? [])
            .filter((incident) =>
                `${incident.title} ${incident.author} ${incident.id}`.toLowerCase().includes(needle)
                && (authorFilter === "all" || incident.author === authorFilter)
                && incident.date >= cutoff
            )
            .sort((a, b) => {
                if (sortOrder === "oldest") return a.date - b.date;
                if (sortOrder === "number") return b.id - a.id;
                return b.date - a.date;
            });
    }, [authorFilter, dateFilter, debouncedValue, query.data, sortOrder]);

    const activeFilterCount = Number(dateFilter !== "all") + Number(authorFilter !== "all");
    const hasRefinements = activeFilterCount > 0 || sortOrder !== "newest";
    const resetFilters = () => {
        setDateFilter("all");
        setAuthorFilter("all");
        setSortOrder("newest");
    };

    const openIncident = (incident: PartialIncidentData) =>
        navigate(String(incident.id), { state: { summary: incident } });

    return (
        <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }} className="flex h-full flex-col overflow-hidden">
            <header className="relative overflow-hidden border-b border-white/[0.07] px-7 pb-6 pt-7">
                <div className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-blue-500/[0.07] blur-3xl" />
                <div className="relative mb-6 flex items-end justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                            <ShieldCheck className="h-4 w-4" /> Case management
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white">Incidents</h1>
                        <p className="mt-1 text-sm text-neutral-400">Find case files, involved parties, evidence and outcomes.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs text-neutral-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {query.data?.length ?? 0} case files indexed
                        </div>
                        <button type="button" onClick={() => navigate("new")} className="flex h-9 items-center gap-2 rounded-lg bg-blue-500 px-3.5 text-xs font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                            <FilePlus2 className="h-4 w-4" /> New incident
                        </button>
                    </div>
                </div>
                <div className="relative max-w-3xl">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <input aria-label="Search incidents" value={search} onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by title, reporting officer or incident number..."
                        className="h-12 w-full rounded-xl border border-white/[0.09] bg-[#252727] pl-11 pr-12 text-sm text-white shadow-sm outline-none transition placeholder:text-neutral-500 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10" />
                    <AnimatePresence>{search && <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSearch("")} aria-label="Clear search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-neutral-500 hover:bg-white/[0.06] hover:text-white">
                        <X className="h-4 w-4" />
                    </motion.button>}</AnimatePresence>
                    {isDebouncing && <motion.div className="absolute bottom-0 left-4 h-px w-24 bg-blue-400"
                        animate={{ x: [0, 400, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} />}
                </div>
                <div className="relative mt-3 flex flex-wrap items-center gap-2">
                    <div className="mr-1 flex items-center gap-2 text-xs font-medium text-neutral-500">
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        Refine
                        {activeFilterCount > 0 && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-1 text-[9px] font-bold text-white">{activeFilterCount}</span>}
                    </div>
                    <Select className="w-[150px]" label="Date" value={dateFilter} options={DATE_FILTERS} active={dateFilter !== "all"} onChange={(value) => setDateFilter(value as DateFilter)} />
                    <Select className="w-[220px]" label="Officer" value={authorFilter} options={authorOptions} active={authorFilter !== "all"} onChange={setAuthorFilter} />
                    <Select className="w-[190px]" label="Sort" value={sortOrder} options={SORT_OPTIONS} active={sortOrder !== "newest"} onChange={(value) => setSortOrder(value as SortOrder)} />
                    <AnimatePresence>{hasRefinements && <motion.button type="button" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        onClick={resetFilters} className="ml-1 flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs text-neutral-500 transition hover:bg-white/[0.05] hover:text-neutral-200">
                        <RotateCcw className="h-3.5 w-3.5" /> Reset
                    </motion.button>}</AnimatePresence>
                </div>
            </header>

            <section className="min-h-0 flex-1 overflow-y-auto px-7 py-5">
                <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                    <span>{search || activeFilterCount ? `${incidents.length} matching cases` : "Recent case files"}</span>
                    <span>{sortOrder === "oldest" ? "Oldest first" : sortOrder === "number" ? "Highest case number" : "Newest first"}</span>
                </div>
                {query.isLoading ? <IncidentSkeleton /> : query.isError ? (
                    <EmptyState title="Case files unavailable" body="The incident database could not be reached." action={() => query.refetch()} />
                ) : incidents.length === 0 ? (
                    <EmptyState title="No matching incidents" body="Try changing your search or clearing one of the active filters." action={hasRefinements ? resetFilters : undefined} actionLabel="Clear filters" />
                ) : (
                    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.035 } } }} className="space-y-2.5">
                        {incidents.map((incident) => (
                            <motion.button key={incident.id} variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}
                                onClick={() => openIncident(incident)}
                                className="group grid w-full grid-cols-[52px_minmax(0,1fr)_190px_40px] items-center gap-4 rounded-xl border border-white/[0.065] bg-white/[0.025] p-3 text-left transition hover:-translate-y-px hover:border-blue-400/25 hover:bg-blue-400/[0.045] focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/[0.07] bg-[#292b2b] font-mono text-[11px] font-semibold text-neutral-400 group-hover:text-blue-300">
                                    #{incident.id}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="truncate text-sm font-medium text-neutral-100 group-hover:text-white">{incident.title}</h2>
                                    <p className="mt-1 text-xs text-neutral-500">Filed by <span className="text-neutral-400">{incident.author}</span></p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                    <CalendarDays className="h-3.5 w-3.5" /> {formatDate(incident.date)}
                                </div>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 transition group-hover:bg-blue-500/10 group-hover:text-blue-300">
                                    <ArrowUpRight className="h-4 w-4" />
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </section>
        </motion.main>
    );
}

function EmptyState({ title, body, action, actionLabel = "Try again" }: { title: string; body: string; action?: () => void; actionLabel?: string }) {
    return <div className="flex h-64 flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4"><FileSearch className="h-7 w-7 text-neutral-500" /></div>
        <h2 className="font-medium text-white">{title}</h2><p className="mt-1 text-sm text-neutral-500">{body}</p>
        {action && <button onClick={action} className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-400">{actionLabel}</button>}
    </div>;
}

function IncidentSkeleton() {
    return <div className="space-y-2.5">{Array.from({ length: 6 }, (_, i) => <div key={i} className="h-[74px] animate-pulse rounded-xl border border-white/[0.05] bg-white/[0.025]" />)}</div>;
}
