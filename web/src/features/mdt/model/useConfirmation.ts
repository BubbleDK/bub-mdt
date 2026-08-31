import { createContext, useContext } from "react";

export type ConfirmAction = (message: string) => Promise<boolean>;
export const ConfirmationContext = createContext<ConfirmAction | null>(null);

export function useConfirmation(): ConfirmAction {
    const confirm = useContext(ConfirmationContext);
    if (!confirm) throw new Error("ConfirmationProvider is missing");
    return confirm;
}
