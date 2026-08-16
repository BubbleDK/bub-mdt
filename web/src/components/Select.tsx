import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface SelectOption {
    label: string;
    value: string;
    description?: string;
}

interface SelectProps {
    label?: string;
    value: string;
    options: readonly SelectOption[];
    onChange: (value: string) => void;
    ariaLabel?: string;
    placeholder?: string;
    active?: boolean;
    disabled?: boolean;
    className?: string;
}

interface MenuPosition {
    left: number;
    top: number;
    width: number;
}

export function Select({
    label,
    value,
    options,
    onChange,
    ariaLabel,
    placeholder = "Select an option",
    active = false,
    disabled = false,
    className = "",
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [position, setPosition] = useState<MenuPosition | null>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const listboxId = useId();
    const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
    const selectedOption = options[selectedIndex];

    const updatePosition = () => {
        const trigger = triggerRef.current;
        if (!trigger) return;
        const rect = trigger.getBoundingClientRect();
        const width = Math.max(rect.width, 190);
        const estimatedHeight = Math.min(options.length * 48 + 12, 256);
        const opensUpward = window.innerHeight - rect.bottom < estimatedHeight + 12
            && rect.top > estimatedHeight;
        setPosition({
            left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
            top: opensUpward ? rect.top - estimatedHeight - 6 : rect.bottom + 6,
            width,
        });
    };

    useLayoutEffect(() => {
        if (!isOpen) return;
        setHighlightedIndex(selectedIndex);
        updatePosition();
    }, [isOpen, selectedIndex]);

    useEffect(() => {
        if (!isOpen) return;
        const closeOnOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node;
            if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) setIsOpen(false);
        };
        const reposition = () => updatePosition();
        document.addEventListener("mousedown", closeOnOutsideClick);
        window.addEventListener("resize", reposition);
        window.addEventListener("scroll", reposition, true);
        return () => {
            document.removeEventListener("mousedown", closeOnOutsideClick);
            window.removeEventListener("resize", reposition);
            window.removeEventListener("scroll", reposition, true);
        };
    }, [isOpen]);

    const chooseOption = (index: number) => {
        const option = options[index];
        if (!option) return;
        onChange(option.value);
        setIsOpen(false);
        triggerRef.current?.focus();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Escape") {
            setIsOpen(false);
            return;
        }
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
                return;
            }
            const direction = event.key === "ArrowDown" ? 1 : -1;
            setHighlightedIndex((current) => (current + direction + options.length) % options.length);
        }
        if ((event.key === "Enter" || event.key === " ") && isOpen) {
            event.preventDefault();
            chooseOption(highlightedIndex);
        }
    };

    return <div className={className}>
        <button ref={triggerRef} type="button" disabled={disabled} aria-label={ariaLabel ?? label}
            aria-haspopup="listbox" aria-expanded={isOpen} aria-controls={isOpen ? listboxId : undefined}
            onClick={() => setIsOpen((open) => !open)} onKeyDown={handleKeyDown}
            className={`group flex h-9 w-full items-center rounded-lg border pl-2.5 pr-2 text-left text-xs outline-none transition disabled:cursor-not-allowed disabled:opacity-50 ${active || isOpen ? "border-blue-400/35 bg-blue-400/[0.09] text-blue-100 shadow-[0_0_0_3px_rgba(59,130,246,0.07)]" : "border-white/[0.08] bg-white/[0.03] text-neutral-300 hover:border-white/[0.13] hover:bg-white/[0.055]"}`}>
            {label && <span className="mr-1 shrink-0 text-neutral-600">{label}:</span>}
            <span className="min-w-0 flex-1 truncate font-medium">{selectedOption?.label ?? placeholder}</span>
            <ChevronDown className={`ml-2 h-3.5 w-3.5 shrink-0 text-neutral-500 transition-transform duration-200 group-hover:text-neutral-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>
        {typeof document !== "undefined" && createPortal(
            <AnimatePresence>{isOpen && position && <motion.div ref={menuRef} id={listboxId} role="listbox"
                initial={{ opacity: 0, y: -5, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
                style={{ left: position.left, top: position.top, width: position.width }}
                className="fixed z-[1000] max-h-64 overflow-y-auto rounded-xl border border-white/[0.1] bg-[#292b2b]/[0.98] p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl">
                {options.map((option, index) => {
                    const selected = option.value === value;
                    const highlighted = highlightedIndex === index;
                    return <button type="button" role="option" aria-selected={selected} key={option.value}
                        onMouseEnter={() => setHighlightedIndex(index)} onClick={() => chooseOption(index)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left outline-none transition ${highlighted ? "bg-white/[0.07]" : "hover:bg-white/[0.045]"}`}>
                        <span className="min-w-0 flex-1"><span className={`block truncate text-xs font-medium ${selected ? "text-blue-200" : "text-neutral-200"}`}>{option.label}</span>{option.description && <span className="mt-0.5 block truncate text-[10px] text-neutral-500">{option.description}</span>}</span>
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${selected ? "bg-blue-500 text-white" : "text-transparent"}`}><Check className="h-3 w-3" /></span>
                    </button>;
                })}
            </motion.div>}</AnimatePresence>,
            document.body
        )}
    </div>;
}
