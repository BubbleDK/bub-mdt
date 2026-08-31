import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, FileText, SearchX } from "lucide-react";
import type { PartialReportData } from "../../../typings";
import { SearchField, Status } from "../../mdt/ui/Workspace";
import { dateLabel } from "../../mdt/lib/dateLabel";

export function ReportIndex({
    reports,
    pending,
    loading,
    onOpen,
}: {
    reports: PartialReportData[];
    pending: boolean;
    loading: boolean;
    onOpen: (id: number, title: string) => void;
}) {
    const [search, setSearch] = useState("");
    const reducedMotion = useReducedMotion();
    const [order, setOrder] = useState("newest");
    const filtered = reports
        .filter((item) =>
            `${item.title} ${item.id} ${item.author}`.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => (order === "oldest" ? a.date - b.date : b.date - a.date));
    return (
        <>
            <div className="report-library-intro">
                <div className="report-library-icon">
                    <FileText size={30} strokeWidth={1.3} />
                </div>
                <div>
                    <span className="report-kicker">The written record</span>
                    <h2>Every account, in one place.</h2>
                    <p>Find the facts by report title, author or file number.</p>
                </div>
                <div className="report-file-count">
                    <strong>{loading ? "—" : reports.length}</strong>
                    <span>reports indexed</span>
                </div>
            </div>
            <div className="report-index-tools">
                <SearchField
                    value={search}
                    onChange={setSearch}
                    placeholder="Search title, author or report ID"
                />
                <label>
                    Sort by
                    <select
                        aria-label="Sort reports"
                        value={order}
                        onChange={(event) => setOrder(event.target.value)}
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                    </select>
                </label>
            </div>
            <section className="report-archive" aria-label="Report archive" aria-busy={loading}>
                <div className="report-archive-labels">
                    <span>Report / {loading ? "Loading" : filtered.length} results</span>
                    <span>Filed by</span>
                    <span>Recorded</span>
                    <span />
                </div>
                {loading && (
                    <div className="p-5">
                        <Status pending />
                    </div>
                )}
                <AnimatePresence initial={false} mode="popLayout">
                    {filtered.map((item, index) => (
                        <motion.button
                            layout={reducedMotion ? false : "position"}
                            initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : 0.1 } }}
                            transition={{
                                duration: reducedMotion ? 0 : 0.2,
                                delay: reducedMotion ? 0 : Math.min(index, 5) * 0.02,
                                layout: { duration: reducedMotion ? 0 : 0.2 },
                            }}
                            className="report-file"
                            key={item.id}
                            onClick={() => onOpen(item.id, item.title)}
                            disabled={pending}
                        >
                            <div className="report-file-name">
                                <span className="report-file-icon">
                                    <FileText size={20} strokeWidth={1.4} />
                                </span>
                                <div>
                                    <small>REPORT #{item.id}</small>
                                    <h3>{item.title}</h3>
                                </div>
                            </div>
                            <span className="report-file-author">
                                {item.author || "Author not recorded"}
                            </span>
                            <time className="report-file-date">{dateLabel(item.date)}</time>
                            <ArrowUpRight size={17} className="report-file-arrow" />
                        </motion.button>
                    ))}
                </AnimatePresence>
                {!filtered.length && !pending && (
                    <div className="report-no-results">
                        <SearchX size={28} />
                        <h3>{search ? "No matching reports" : "The archive is empty"}</h3>
                        <p>
                            {search
                                ? "Try a different title, author or report number."
                                : "Create a report to start documenting your first account."}
                        </p>
                    </div>
                )}
            </section>
        </>
    );
}
