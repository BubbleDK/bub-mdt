import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ConfirmationContext } from "../model/useConfirmation";
import useAppVisibilityStore from "../../../stores/appVisibilityStore";
import { Dialog } from "./Workspace";

export function ConfirmationProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState<string | null>(null);
    const resolve = useRef<((confirmed: boolean) => void) | null>(null);
    const visible = useAppVisibilityStore((state) => state.showApp);
    const settle = useCallback((confirmed: boolean) => {
        resolve.current?.(confirmed);
        resolve.current = null;
        setMessage(null);
    }, []);
    const confirm = useCallback((text: string) => {
        resolve.current?.(false);
        setMessage(text);
        return new Promise<boolean>((done) => {
            resolve.current = done;
        });
    }, []);
    useEffect(() => {
        if (!visible) settle(false);
    }, [visible, settle]);
    useEffect(
        () => () => {
            resolve.current?.(false);
        },
        []
    );
    return (
        <ConfirmationContext.Provider value={confirm}>
            {children}
            {message && visible && (
                <Dialog title="Confirm action" onClose={() => settle(false)}>
                    <p className="muted">{message}</p>
                    <div className="workspace-row mt-6">
                        <button onClick={() => settle(false)}>Cancel</button>
                        <button className="danger" onClick={() => settle(true)}>
                            Confirm
                        </button>
                    </div>
                </Dialog>
            )}
        </ConfirmationContext.Provider>
    );
}
