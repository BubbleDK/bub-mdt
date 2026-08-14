import { ClipboardList, LoaderCircle, Save } from "lucide-react";
import { ProfilePanel } from "./ProfilePanel";

interface ProfileNotesPanelProps {
    notes: string;
    onChange: (notes: string) => void;
    onSave: () => void;
    isSaving: boolean;
    isSaved: boolean;
    hasError: boolean;
}

export function ProfileNotesPanel({
    notes,
    onChange,
    onSave,
    isSaving,
    isSaved,
    hasError,
}: ProfileNotesPanelProps) {
    return (
        <ProfilePanel
            title="Officer notes"
            icon={<ClipboardList />}
            delay={0.1}
            className="flex h-full flex-col"
        >
            <label htmlFor="profile-notes" className="sr-only">
                Officer notes
            </label>
            <textarea
                id="profile-notes"
                value={notes}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Add operational notes about this citizen..."
                className="min-h-[440px] flex-1 resize-none rounded-xl border border-white/[0.08] bg-[#1b1d1e] p-4 text-sm leading-6 text-neutral-200 outline-none transition placeholder:text-neutral-600 focus:border-blue-500/45 focus:ring-4 focus:ring-blue-500/[0.07]"
            />
            <div className="mt-3 flex items-center justify-between">
                <span
                    className={`text-xs ${hasError ? "text-red-300" : "text-neutral-600"}`}
                    role={hasError ? "alert" : undefined}
                >
                    {hasError
                        ? "Notes could not be saved. Please try again."
                        : "Notes are visible to authorized personnel."}
                </span>
                <button
                    type="button"
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/10 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSaving ? (
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Save className="h-3.5 w-3.5" />
                    )}
                    {isSaved ? "Saved" : "Save notes"}
                </button>
            </div>
        </ProfilePanel>
    );
}
