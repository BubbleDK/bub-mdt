import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { FocusTrap } from "focus-trap-react";

interface CommandPaletteProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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
                            fallbackFocus: () =>
                                inputRef.current || document.body,
                        }}
                    >
                        <motion.div
                            ref={panelRef}
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
                                    <Command.Item
                                        onSelect={() =>
                                            alert("Profile clicked")
                                        }
                                        className="flex items-center p-3 rounded-md text-sm text-gray-200 cursor-pointer hover:bg-neutral-800 focus:bg-neutral-700 focus:outline-none"
                                    >
                                        Profile
                                    </Command.Item>
                                    <Command.Item
                                        onSelect={() =>
                                            alert("Settings clicked")
                                        }
                                        className="flex items-center p-3 rounded-md text-sm text-gray-200 cursor-pointer hover:bg-neutral-800 focus:bg-neutral-700 focus:outline-none"
                                    >
                                        Settings
                                    </Command.Item>
                                    <Command.Item
                                        onSelect={() => alert("Logout clicked")}
                                        className="flex items-center p-3 rounded-md text-sm text-gray-200 cursor-pointer hover:bg-neutral-800 focus:bg-neutral-700 focus:outline-none"
                                    >
                                        Logout
                                    </Command.Item>
                                </Command.List>
                            </Command>
                        </motion.div>
                    </FocusTrap>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
