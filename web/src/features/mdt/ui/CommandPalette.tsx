import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { FocusTrap } from "focus-trap-react";
import { MDT_NAVIGATION } from "../../tabs/config/mdtNavigation";
import { useTabStore } from "../../tabs/model/useTabStore";
import { createTabWindow } from "../../tabs/lib/createTabWindow";
import useConfigStore from "../../../stores/configStore";

interface CommandPaletteProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const addTab = useTabStore((state) => state.addTab);
    const dispatchEnabled = useConfigStore((state) => state.config.isDispatchEnabled);

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="absolute inset-0 z-50 bg-black/50 flex py-3 justify-center rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setOpen(false)}
                >
                    <FocusTrap
                        active={open}
                        focusTrapOptions={{
                            clickOutsideDeactivates: true,
                            escapeDeactivates: false,
                            fallbackFocus: () => inputRef.current || document.body,
                        }}
                    >
                        <motion.div
                            ref={panelRef}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Navigate MDT"
                            className="w-full max-w-[42rem] bg-[rgba(22,22,22,0.7)] rounded-xl p-2 border border-neutral-700 shadow-xl outline-none h-[30rem]"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Command loop className="w-full">
                                <Command.Input
                                    ref={inputRef}
                                    placeholder="Type a command..."
                                    className="w-full border-0 border-b border-neutral-700 text-[17px] px-2 pb-4 pt-2 mb-4 bg-transparent text-gray-100 placeholder:text-gray-400 outline-none"
                                />
                                <Command.List className="max-h-[400px] overflow-auto">
                                    <Command.Empty className="p-4 text-sm text-neutral-400">
                                        No matching sections.
                                    </Command.Empty>
                                    {MDT_NAVIGATION.filter(
                                        (item) => dispatchEnabled || item.path !== "/dispatch"
                                    ).map(({ path, label, icon: Icon }) => (
                                        <Command.Item
                                            key={path}
                                            value={label}
                                            onSelect={() => {
                                                addTab(createTabWindow(path));
                                                setOpen(false);
                                            }}
                                            className="flex items-center gap-3 p-3 rounded-md text-sm text-gray-200 cursor-pointer data-[selected=true]:bg-neutral-700"
                                        >
                                            <Icon size={18} />
                                            {label}
                                            <span className="ml-auto text-xs text-neutral-500">
                                                Open in new tab
                                            </span>
                                        </Command.Item>
                                    ))}
                                </Command.List>
                            </Command>
                        </motion.div>
                    </FocusTrap>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
