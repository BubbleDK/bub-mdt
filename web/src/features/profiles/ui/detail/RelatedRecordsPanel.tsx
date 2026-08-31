import { ChevronRight, ClipboardList } from "lucide-react";
import type { Profile } from "../../../../typings";
import { formatDate } from "../../lib/profileFormatters";
import { EmptyProfileData, ProfilePanel } from "./ProfilePanel";

type RelatedRecord = NonNullable<Profile["relatedReports"]>[number];

export function RelatedRecordsPanel({
    reports,
    incidents,
    onOpenReports,
    onOpenIncidents,
}: {
    reports: RelatedRecord[];
    incidents: RelatedRecord[];
    onOpenReports: (id: number) => void;
    onOpenIncidents: (id: number) => void;
}) {
    return (
        <ProfilePanel
            title="Related records"
            icon={<ClipboardList />}
            delay={0.22}
            className="mt-5"
        >
            <div className="related-records-grid grid grid-cols-2 gap-6">
                <RecordList label="Reports" records={reports} onSelect={onOpenReports} />
                <div className="min-w-0 border-l border-white/[0.07] pl-6">
                    <RecordList label="Incidents" records={incidents} onSelect={onOpenIncidents} />
                </div>
            </div>
        </ProfilePanel>
    );
}

function RecordList({
    label,
    records,
    onSelect,
}: {
    label: string;
    records: RelatedRecord[];
    onSelect: (id: number) => void;
}) {
    return (
        <div className="min-w-0">
            <div className="mb-2 flex items-center justify-between text-xs text-neutral-500">
                <span>{label}</span>
                <span>{records.length}</span>
            </div>
            {records.length ? (
                <div className="max-h-[210px] space-y-1.5 overflow-y-auto overscroll-contain pr-2">
                    {records.map((record) => (
                        <button
                            type="button"
                            key={record.id}
                            onClick={() => onSelect(record.id)}
                            className="group flex w-full items-center gap-3 rounded-lg border border-transparent p-2.5 text-left transition hover:border-white/[0.08] hover:bg-white/[0.045] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-neutral-300">
                                    {record.title}
                                </p>
                                <p className="mt-0.5 text-[11px] text-neutral-600">
                                    {record.author} / {formatDate(record.date)}
                                </p>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-neutral-700 transition group-hover:translate-x-0.5 group-hover:text-neutral-400" />
                        </button>
                    ))}
                </div>
            ) : (
                <EmptyProfileData>No related {label.toLowerCase()}</EmptyProfileData>
            )}
        </div>
    );
}
