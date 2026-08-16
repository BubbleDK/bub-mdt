import { LoaderCircle, Plus, Shield, Trash2, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function IncidentPanel({
    icon: Icon,
    eyebrow,
    title,
    action,
    children,
}: {
    icon: LucideIcon;
    eyebrow: string;
    title: string;
    action?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        {eyebrow}
                    </p>
                    <h2 className="mt-1 text-sm font-semibold text-white">{title}</h2>
                </div>
                <div className="flex items-center gap-2">
                    {action}
                    <div className="rounded-lg border border-white/[0.06] bg-white/[0.035] p-2 text-neutral-500">
                        <Icon className="h-4 w-4" />
                    </div>
                </div>
            </div>
            {children}
        </section>
    );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.035] px-2.5 text-[11px] font-medium text-neutral-300 hover:border-blue-400/25 hover:bg-blue-400/[0.07] hover:text-white">
            <Plus className="h-3.5 w-3.5" />
            {label}
        </button>
    );
}

export function RemoveButton({ label, loading, onClick }: { label: string; loading: boolean; onClick: () => void }) {
    return (
        <button type="button" aria-label={label} title={label} disabled={loading} onClick={onClick} className="rounded-md p-2 text-neutral-600 hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50">
            {loading ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
        </button>
    );
}

export function EmptyCollection({ icon: Icon = Shield, text, compact = false }: { icon?: LucideIcon; text: string; compact?: boolean }) {
    return (
        <div className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.07] text-center ${compact ? "py-5" : "py-8"}`}>
            <Icon className="h-5 w-5 text-neutral-600" />
            <p className="mt-2 text-xs text-neutral-500">{text}</p>
        </div>
    );
}

export function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
            <Icon className="h-4 w-4 text-blue-400" />
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">{label}</p>
            <p className="mt-1 text-lg font-semibold text-white">{value}</p>
        </div>
    );
}
