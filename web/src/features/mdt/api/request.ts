import { fetchNui } from "../../../utils/fetchNui";

// All adapters use the original NUI transport. Payload shape belongs to each feature.
export async function mutate(event: string, payload?: unknown): Promise<void> {
    const result = await fetchNui<unknown>(event, payload, { data: true });
    if (result === false || result === 0)
        throw new Error("The server declined this change. Your data has not been changed.");
}
