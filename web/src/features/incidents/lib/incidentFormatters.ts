import type { Evidence } from "../../../typings";

export const EMPTY_EVIDENCE: Evidence = { label: "", image: "" };

export function getEvidenceKey(evidence: Evidence): string {
    return `${evidence.label}\u0000${evidence.image}`;
}

export function formatIncidentDate(date?: number): string {
    if (!date) return "Date unavailable";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
}

export function createEvidence(
    draft: Evidence,
    existingEvidence: Evidence[]
): { evidence?: Evidence; error?: string } {
    const evidence = {
        label: draft.label.trim(),
        image: draft.image.trim(),
    };

    if (!evidence.label || !evidence.image) {
        return { error: "Add both a label and an image URL." };
    }

    try {
        const url = new URL(evidence.image);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error("Unsupported protocol");
    } catch {
        return { error: "Enter a valid image URL." };
    }

    if (existingEvidence.some((item) => getEvidenceKey(item) === getEvidenceKey(evidence))) {
        return { error: "This evidence item is already attached." };
    }

    return { evidence };
}
