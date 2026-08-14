import dayjs from "dayjs";

export function formatDate(value: number | string): string {
    if (typeof value === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        return value;
    }
    return dayjs(value).format("DD MMM YYYY");
}

export function getInitials(firstname: string, lastname: string): string {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
}

export function plainTextNotes(notes?: string): string {
    if (!notes) return "";
    return notes.replace(/<[^>]*>/g, "").trim();
}
