import { useRef, useState } from "react";

/** Serializes mutations and retains a visible error instead of optimistic success. */
export function useAction() {
    const lock = useRef(false);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const run = async (action: () => Promise<unknown>) => {
        if (lock.current) return;
        lock.current = true;
        setPending(true);
        setError(null);
        try {
            await action();
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "The request failed. Please try again."
            );
        } finally {
            lock.current = false;
            setPending(false);
        }
    };
    return { pending, error, run };
}
