import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import { FocusTrap } from "focus-trap-react";
import { createPortal } from "react-dom";
import useAppVisibilityStore from "../../../stores/appVisibilityStore";

export function Workspace({
    eyebrow,
    title,
    description,
    actions,
    children,
    className = "",
    scrollKey,
}: {
    eyebrow: string;
    title: string;
    description: string;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
    scrollKey?: string | number;
}) {
    const scrollContainer = useRef<HTMLElement>(null);
    useLayoutEffect(() => {
        if (scrollKey !== undefined && scrollContainer.current)
            scrollContainer.current.scrollTop = 0;
    }, [scrollKey]);
    return (
        <section ref={scrollContainer} className={`workspace ${className}`}>
            <header key={scrollKey} className="workspace-heading">
                <div>
                    <p className="eyebrow">{eyebrow}</p>
                    <h1>{title}</h1>
                    <p className="muted">{description}</p>
                </div>
                <div className="workspace-actions">{actions}</div>
            </header>
            {children}
        </section>
    );
}
export function Panel({
    title,
    actions,
    children,
    className = "",
}: {
    title: string;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section className={`workspace-panel ${className}`}>
            <header>
                <h2>{title}</h2>
                {actions}
            </header>
            <div className="panel-body">{children}</div>
        </section>
    );
}
export function SearchField({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}) {
    return (
        <label className="workspace-search">
            <Search size={18} aria-hidden />
            <input
                type="search"
                aria-label={placeholder}
                placeholder={placeholder}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </label>
    );
}
export function Empty({ children }: { children: ReactNode }) {
    return <p className="workspace-empty">{children}</p>;
}
export function Status({ error, pending }: { error?: string | null; pending?: boolean }) {
    return error ? (
        <p className="workspace-error" role="alert">
            {error}
        </p>
    ) : pending ? (
        <p className="muted" role="status">
            Loading…
        </p>
    ) : null;
}
export function Stat({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div className="workspace-stat">
            <strong>{value}</strong>
            <span>{label}</span>
        </div>
    );
}
export function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="workspace-field">
            <span>{label}</span>
            {children}
        </label>
    );
}

export function Dialog({
    title,
    onClose,
    children,
}: {
    title: string;
    onClose: () => void;
    children: ReactNode;
}) {
    const visible = useAppVisibilityStore((state) => state.showApp);
    if (!visible) return null;
    return createPortal(
        <div
            className="workspace-dialog-backdrop"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <FocusTrap focusTrapOptions={{ escapeDeactivates: false, allowOutsideClick: true }}>
                <section
                    role="dialog"
                    aria-modal="true"
                    aria-label={title}
                    className="workspace-dialog"
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            event.stopPropagation();
                            onClose();
                        }
                    }}
                >
                    <header>
                        <h2>{title}</h2>
                        <button type="button" aria-label="Close dialog" onClick={onClose}>
                            <X size={18} />
                        </button>
                    </header>
                    {children}
                </section>
            </FocusTrap>
        </div>,
        document.body
    );
}
