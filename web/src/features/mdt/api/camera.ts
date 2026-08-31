import { mutate } from "./request";
import { isEnvBrowser } from "../../../utils/misc";
// The legacy camera completion event omits the record ID. Retain the target at request time.
let pending: { id: number; type: "report" | "incident" } | null = null;
export async function takeEvidencePicture(
    id: number,
    imageLabel: string,
    type: "report" | "incident"
) {
    if (isEnvBrowser())
        throw new Error(
            "Photo capture is available in game. Attach an image URL in browser preview."
        );
    pending = { id, type };
    try {
        await mutate("takePicture", { id, imageLabel, type });
    } catch (error) {
        pending = null;
        throw error;
    }
}
export function consumeCameraTarget(type: "report" | "incident") {
    if (pending?.type !== type) return null;
    const target = pending;
    pending = null;
    return target;
}
